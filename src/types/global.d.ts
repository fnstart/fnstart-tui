import type { NodeApp as ReziNodeApp } from "@rezi-ui/node";

declare global {
  type NodeApp<S> = ReziNodeApp<S>;

  type PageName = "MouseInfo" | "Introduction" | "Home";

  type RouterCreateArray = {
    id: PageName;
    component: () => Promise<any>;
    fallback?: PageName;
    middleware?: (object: RouterCreateArray) => boolean;
    keybinding?: string;
    active?: boolean;
  };

  type RouterBundle = {
    config: RouterCreateArray;
    render: (props: {
      app: NodeApp<State>;
      state: State;
      route: RouterClass;
    }) => any;
  };

  type RouterState = {
    bundles: Record<string, Record<string, RouterBundle>>;
  };

  type RouterConfig = {
    saveOrder: boolean;
  };

  type RouterClass = {
    id: string;
    app: NodeApp<State> | undefined;
    state: RouterState | undefined;
    config: RouterConfig | undefined;
    pages: RouterCreateArray[];
    junk: Record<string, any>;
    create: (components: RouterCreateArray[]) => void;
    current: (state: State) => RouterBundle["render"] | null;
    page: PageName;
    currentPage: PageName | null;
    order: PageName[];
    go: (targetId: PageName) => void;
    back: () => void;
  };

  type PageComponent = {
    app: NodeApp<State>;
    state: State;
    route: RouterClass;
  };

  type State = {
    logo: string[];
    section: number;
    version: number;
    bundles: RouterState["bundles"];
  };

  type SectionKey = "welcome" | "tech";
  type SectionErrorTypes = "NOT_A_STRING" | "INVALID_SECTION_KEY";

  type SectionArray = {
    key: SectionKey;
    title: string;
    component: () => any;
    keybind: string;
  };

  type SectionError = {
    type: SectionErrorTypes;
    key: unknown;
  };
}

export {};
