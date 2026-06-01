type RouterCreateArray = {
  id: PageName;
  component: () => Promise<any>;
  fallback?: PageName;
  middleware?: (object: RouterCreateArray) => boolean;
  keybinding?: string;
  active?: boolean;
};

type RouterState = {
  bundles: Record<
    string,
    Record<
      string,
      {
        config: RouterCreateArray;
        render: (props: { app: NodeApp<State> }) => any;
      }
    >
  >;
};

type RouterClass = {
  id: string;
  app: NodeApp<State> | undefined;
  state: RouterState | undefined;
  pages: RouterCreateArray[];
  create: (components: RouterCreateArray[]) => void;
  current: (state: State) => any;
  page: PageName;
};

class Router implements RouterClass {
  id: string;
  app: RouterClass["app"] = undefined;
  state: RouterClass["state"] = undefined;
  pages: RouterClass["pages"] = [];

  create: RouterClass["create"] = (components) => {
    this.pages = components;

    components.forEach((data) => {
      if (!data.id) return;

      data
        .component()
        .then((module) => {
          const tryUpdate = () => {
            if (this.app) {
              try {
                this.app.update((state) => {
                  const newBundles = { ...state.bundles };

                  if (!newBundles[this.id]) {
                    newBundles[this.id] = {};
                  }

                  newBundles[this.id][data.id] = {
                    config: data,
                    render: module.default,
                  };

                  return {
                    ...state,
                    bundles: newBundles,
                  };
                });
              } catch (err: any) {
                if (err && err.code === "ZRUI_INVALID_STATE") {
                  setTimeout(tryUpdate, 10);
                }
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
    if (!state || !state.bundles) return null;
    const routerBundles = state.bundles[this.id];
    if (!routerBundles) return null;

    let activeRenderFn: any = null;

    Object.values(routerBundles).forEach((bundle: any) => {
      if (bundle && bundle.config && bundle.config.active) {
        activeRenderFn = bundle.render;
      }
    });

    return activeRenderFn;
  };

  set page(targetId: PageName) {
    if (!this.app) return;

    this.app.update((state) => {
      const newBundles = { ...state.bundles };
      const currentRouterBundles = { ...newBundles[this.id] };

      Object.keys(currentRouterBundles).forEach((id) => {
        const targetBundle = currentRouterBundles[id];
        if (targetBundle && targetBundle.config) {
          currentRouterBundles[id] = {
            ...targetBundle,
            config: {
              ...targetBundle.config,
              active: id === targetId,
            },
          };
        }
      });

      newBundles[this.id] = currentRouterBundles;

      return {
        ...state,
        bundles: newBundles,
        version: state.version + 1,
      };
    });
  }

  get page(): PageName {
    return "home";
  }

  constructor(app: NodeApp<State>, routerId: string = "mainRouter") {
    this.app = app;
    this.id = routerId;
  }
}

export default Router;
