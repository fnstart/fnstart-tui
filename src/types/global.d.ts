import { type NodeApp as ReziNodeApp } from "@rezi-ui/node";

declare global {
  type PageName = "MouseInfo" | "Introduction" | "home";

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
    current: () => any;
    page: PageName;
  };

  type PageComponent = {
    app: NodeApp<State>;
    state: State;
    route: RouterClass;
  };

  type NodeApp<S> = ReziNodeApp<S>;

  type State = {
    logo: string[];
    section: number;
    version: number;
    bundles: Record<string, any>;
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
    key: any;
  };
}

export {};
