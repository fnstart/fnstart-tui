class Router implements RouterClass {
  id: string;
  app: RouterClass["app"] = undefined;
  state: RouterClass["state"] = undefined;
  config: RouterClass["config"] = undefined;
  pages: RouterClass["pages"] = [];
  junk: RouterClass["junk"] = {};

  create: RouterClass["create"] = (components) => {
    this.pages = components;

    components.forEach((data) => {
      if (!data.id) return;

      data
        .component()
        .then((module) => {
          const tryUpdate = () => {
            if (!this.app) return;

            try {
              this.app.update((state) => {
                const newBundles = { ...state.bundles };
                const routerBucket = newBundles[this.id] ?? {};

                routerBucket[data.id] = {
                  config: data,
                  render: module.default,
                };

                newBundles[this.id] = routerBucket;

                return {
                  ...state,
                  bundles: newBundles,
                };
              });
            } catch (err: any) {
              if (err?.code === "ZRUI_INVALID_STATE") {
                setTimeout(tryUpdate, 10);
              }
            }
          };

          tryUpdate();
        })
        .catch((err) => {
          console.error(`ID: ${data.id} | Failed to load bundle:`, err);
        });
    });
  };

  current: RouterClass["current"] = (state) => {
    const routerBundles = state?.bundles?.[this.id];
    if (!routerBundles) return null;

    const bundles = Object.values(routerBundles) as RouterBundle[];
    const activeBundle = bundles.find((bundle) => bundle.config.active);

    return activeBundle?.render ?? null;
  };

  private getActivePageFromState(state: State): PageName | null {
    const routerBundles = state?.bundles?.[this.id];
    if (!routerBundles) return null;

    const bundles = Object.values(routerBundles) as RouterBundle[];
    const activeBundle = bundles.find((bundle) => bundle.config.active);

    return activeBundle?.config.id ?? null;
  }

  private switchPage(targetId: PageName) {
    if (!this.app) return;

    this.app.update((state) => {
      const newBundles = { ...state.bundles };
      const currentRouterBundles = { ...(newBundles[this.id] ?? {}) };

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

      return {
        ...state,
        bundles: newBundles,
        version: state.version + 1,
      };
    });
  }

  go(targetId: PageName) {
    if (!this.app) return;

    this.app.update((state) => {
      const currentId = this.getActivePageFromState(state);
      const newBundles = { ...state.bundles };
      const currentRouterBundles = { ...(newBundles[this.id] ?? {}) };

      if (this.config?.saveOrder && currentId && currentId !== targetId) {
        this.order = [...this.order, currentId];
      }

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

      return {
        ...state,
        bundles: newBundles,
        version: state.version + 1,
      };
    });
  }

  back() {
    const previous = this.order.at(-1);
    console.log(previous);
    if (!previous || !this.app) return;

    this.order = this.order.slice(0, -1);

    this.app.update((state) => {
      const newBundles = { ...state.bundles };
      const currentRouterBundles = { ...(newBundles[this.id] ?? {}) };

      Object.keys(currentRouterBundles).forEach((id) => {
        const targetBundle = currentRouterBundles[id] as RouterBundle;

        currentRouterBundles[id] = {
          ...targetBundle,
          config: {
            ...targetBundle.config,
            active: id === previous,
          },
        };
      });

      newBundles[this.id] = currentRouterBundles;

      return {
        ...state,
        bundles: newBundles,
        version: state.version + 1,
      };
    });
  }

  get currentPage(): PageName | null {
    const bundles = this.state?.bundles?.[this.id];
    if (!bundles) return null;

    const activeBundle = (Object.values(bundles) as RouterBundle[]).find(
      (bundle) => bundle.config.active,
    );

    return activeBundle?.config.id ?? null;
  }

  set page(targetId: PageName) {
    console.log(targetId);
    this.go(targetId);
  }

  set order(targetValue: PageName[]) {
    this.junk["ORDER_JUNK"] = targetValue;
  }

  get order(): PageName[] {
    if (!this.junk["ORDER_JUNK"]) {
      this.junk["ORDER_JUNK"] = [];
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
  }
}

export default Router;
