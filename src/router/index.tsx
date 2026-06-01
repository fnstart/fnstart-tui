class Router implements RouterClass {
  id: string;
  app: RouterClass["app"] = undefined;
  state: RouterClass["state"] = undefined;
  config: RouterClass["config"] = undefined;
  pages: RouterClass["pages"] = [];
  junk: RouterClass["junk"] = {};

  private log(label: string, payload?: unknown) {
    console.log(`[Router:${this.id}] ${label}`, payload ?? "");
  }

  private debugBundles(state: State) {
    const routerBundles = state?.bundles?.[this.id];
    if (!routerBundles) {
      this.log("debugBundles -> no routerBundles");
      return;
    }

    const bundles = Object.values(routerBundles) as RouterBundle[];

    this.log(
      "debugBundles",
      bundles.map((bundle) => ({
        id: bundle.config.id,
        active: bundle.config.active ?? false,
      })),
    );
  }

  create: RouterClass["create"] = (components) => {
    this.pages = components;
    this.log(
      "create() called",
      components.map((x) => x.id),
    );

    components.forEach((data) => {
      if (!data.id) return;

      this.log("loading component", data.id);

      data
        .component()
        .then((module) => {
          this.log("component resolved", data.id);

          const tryUpdate = () => {
            if (!this.app) {
              this.log("tryUpdate aborted: no app", data.id);
              return;
            }

            try {
              this.app.update((state) => {
                this.log("create.update() before", {
                  dataId: data.id,
                  bundleKeys: Object.keys(state.bundles ?? {}),
                  routeBucketKeys: Object.keys(state.bundles?.[this.id] ?? {}),
                });

                const newBundles = { ...state.bundles };
                const routerBucket = newBundles[this.id] ?? {};

                routerBucket[data.id] = {
                  config: data,
                  render: module.default,
                };

                newBundles[this.id] = routerBucket;

                const nextState = {
                  ...state,
                  bundles: newBundles,
                };

                this.state = { bundles: nextState.bundles };

                this.log("create.update() after", {
                  dataId: data.id,
                  routeBucketKeys: Object.keys(
                    nextState.bundles?.[this.id] ?? {},
                  ),
                });

                this.debugBundles(nextState);

                return nextState;
              });
            } catch (err: any) {
              this.log("create.update() error", {
                code: err?.code,
                message: err?.message,
              });

              if (err?.code === "ZRUI_INVALID_STATE") {
                setTimeout(tryUpdate, 10);
              }
            }
          };

          tryUpdate();
        })
        .catch((err) => {
          this.log(`Failed to load bundle ${data.id}`, {
            message: err?.message,
            stack: err?.stack,
          });
        });
    });
  };

  current: RouterClass["current"] = (state) => {
    this.state = { bundles: state.bundles };

    const routerBundles = state?.bundles?.[this.id];
    if (!routerBundles) {
      this.log("current() -> no routerBundles");
      return null;
    }

    const bundles = Object.values(routerBundles) as RouterBundle[];
    const activeBundle = bundles.find((bundle) => bundle.config.active);

    this.log("current()", {
      active: activeBundle?.config?.id ?? null,
      available: bundles.map((bundle) => ({
        id: bundle.config.id,
        active: bundle.config.active ?? false,
      })),
    });

    return activeBundle?.render ?? null;
  };

  private getActivePageFromState(state: State): PageName | null {
    const routerBundles = state?.bundles?.[this.id];
    if (!routerBundles) {
      this.log("getActivePageFromState() -> no routerBundles");
      return null;
    }

    const bundles = Object.values(routerBundles) as RouterBundle[];
    const activeBundle = bundles.find((bundle) => bundle.config.active);

    this.log("getActivePageFromState()", {
      active: activeBundle?.config?.id ?? null,
      history: this.order,
    });

    return activeBundle?.config.id ?? null;
  }

  private setActivePageInState(state: State, targetId: PageName): State {
    const newBundles = { ...state.bundles };
    const currentRouterBundles = { ...(newBundles[this.id] ?? {}) };

    this.log("setActivePageInState() before", {
      targetId,
      routeBucketKeys: Object.keys(currentRouterBundles),
      activeBefore: this.getActivePageFromState(state),
    });

    Object.keys(currentRouterBundles).forEach((id) => {
      const targetBundle = currentRouterBundles[id] as RouterBundle;

      currentRouterBundles[id] = {
        ...targetBundle,
        config: {
          ...targetBundle.config,
          active: id === targetId,
        },
      };
    });

    newBundles[this.id] = currentRouterBundles;

    const nextState = {
      ...state,
      bundles: newBundles,
      version: state.version + 1,
    };

    this.log("setActivePageInState() after", {
      targetId,
      activeAfter: (() => {
        const bundles = Object.values(
          nextState.bundles?.[this.id] ?? {},
        ) as RouterBundle[];
        return (
          bundles.find((bundle) => bundle.config.active)?.config.id ?? null
        );
      })(),
      version: nextState.version,
    });

    this.debugBundles(nextState);

    return nextState;
  }

  go(targetId: PageName) {
    if (!this.app) {
      this.log("go() aborted: no app", targetId);
      return;
    }

    this.log("go() called", {
      targetId,
      currentPageGetter: this.currentPage,
      historyBefore: [...this.order],
      saveOrder: this.config?.saveOrder,
    });

    this.app.update((state) => {
      this.state = { bundles: state.bundles };

      const currentId = this.getActivePageFromState(state);

      this.log("go().update() start", {
        currentId,
        targetId,
        historyBefore: [...this.order],
      });

      if (this.config?.saveOrder && currentId && currentId !== targetId) {
        this.order = [...this.order, currentId];
        this.log("go().update() pushed history", {
          pushed: currentId,
          historyAfterPush: [...this.order],
        });
      } else {
        this.log("go().update() did NOT push history", {
          saveOrder: this.config?.saveOrder,
          currentId,
          targetId,
          history: [...this.order],
        });
      }

      const nextState = this.setActivePageInState(state, targetId);
      this.state = { bundles: nextState.bundles };

      this.log("go().update() end", {
        targetId,
        currentPageGetterAfter: this.currentPage,
        historyAfter: [...this.order],
      });

      return nextState;
    });
  }

  back() {
    const previous = this.order.at(-1);

    this.log("back() called", {
      previous,
      historyBefore: [...this.order],
      currentPageGetter: this.currentPage,
    });

    if (!previous || !this.app) {
      this.log("back() aborted", {
        hasPrevious: !!previous,
        hasApp: !!this.app,
      });
      return;
    }

    this.order = this.order.slice(0, -1);

    this.log("back() consumed history", {
      previous,
      historyAfterPop: [...this.order],
    });

    this.app.update((state) => {
      this.state = { bundles: state.bundles };

      this.log("back().update() start", {
        previous,
        currentFromState: this.getActivePageFromState(state),
        historyNow: [...this.order],
      });

      const nextState = this.setActivePageInState(state, previous);
      this.state = { bundles: nextState.bundles };

      this.log("back().update() end", {
        previous,
        currentPageGetterAfter: this.currentPage,
        historyAfter: [...this.order],
      });

      return nextState;
    });
  }

  get currentPage(): PageName | null {
    const bundles = this.state?.bundles?.[this.id];
    if (!bundles) {
      this.log("currentPage getter -> no bundles");
      return null;
    }

    const activeBundle = (Object.values(bundles) as RouterBundle[]).find(
      (bundle) => bundle.config.active,
    );

    const result = activeBundle?.config.id ?? null;

    this.log("currentPage getter", {
      result,
      history: [...this.order],
    });

    return result;
  }

  set page(targetId: PageName) {
    this.log("page setter", {
      targetId,
      currentPageBefore: this.currentPage,
      historyBefore: [...this.order],
    });

    this.go(targetId);
  }

  set order(targetValue: PageName[]) {
    this.log("order setter", {
      before: [...(this.junk["ORDER_JUNK"] ?? [])],
      after: [...targetValue],
    });

    this.junk["ORDER_JUNK"] = targetValue;
  }

  get order(): PageName[] {
    if (!this.junk["ORDER_JUNK"]) {
      this.junk["ORDER_JUNK"] = [];
      this.log("order getter initialized history", []);
    }

    return this.junk["ORDER_JUNK"];
  }

  constructor(
    app: NodeApp<State>,
    routerId: string = "mainRouter",
    config: RouterConfig,
  ) {
    this.app = app;
    this.id = routerId;
    this.config = config;

    this.log("constructor", {
      routerId,
      config,
    });
  }
}

export default Router;
