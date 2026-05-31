/** @jsxImportSource @rezi-ui/jsx */
import { createNodeApp } from "@rezi-ui/node";
import * as rezi from "@rezi-ui/jsx";
import { Result } from "better-result";

import Welcome from "./sections/Welcome";
import Tech from "./sections/Tech";

const logo = [
  "  ██     █████     ██  ",
  "   ███  █     █  ███   ",
  "     ███       ███     ",
  "   ███ █████████ ███   ",
  " ████             ████ ",
];

type PageName = "mouseinfo" | "intro" | "home";

type State = {
  logo: typeof logo;
  screen: PageName;
  section: number;
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

class Section {
  static list: SectionArray[] = [
    {
      key: "welcome",
      title: "Welcome",
      component: Welcome,
      keybind: "w",
    },
    {
      key: "tech",
      title: "Tech Stack",
      component: Tech,
      keybind: "t",
    },
  ];

  static fetch(input: unknown): Result<SectionArray, SectionError> {
    if (typeof input !== "string") {
      return Result.err({ type: "NOT_A_STRING", key: input });
    }

    const exists = Section.list.find((data) => data.key === input);
    if (!exists) {
      return Result.err({ type: "INVALID_SECTION_KEY", key: input });
    }

    return Result.ok(exists);
  }

  static getKey(input: number): string {
    const section = Section.list.find((_, index) => input === index);
    if (section) {
      return section?.key;
    } else {
      return "Unknown";
    }
  }
}

const app = createNodeApp<State>({
  initialState: {
    logo,
    screen: "home",
    section: 1,
  },
});

function MouseInfoScreen() {
  return (
    <rezi.Box border="none" width="full" height="full" alignSelf="center">
      <rezi.Box
        title="Enable mouse support"
        width="full"
        height="full"
        px={2}
        py={1}
      >
        <rezi.Box width="full" height="full" border="none" minWidth={50}>
          <rezi.Text>Mouse support is recommended for this app.</rezi.Text>
          <rezi.Text>
            │ If clicks or scroll do not work, enable mouse reporting in your
            terminal.
          </rezi.Text>
          <rezi.Text>├ macOS Terminal: View → Allow Mouse Reporting</rezi.Text>
          <rezi.Text>
            └ iTerm2: Profile → Terminal → Enable mouse reporting
          </rezi.Text>

          <rezi.Spacer flex={1} />

          <rezi.Row gap={1}>
            <rezi.Button
              id="continueFromMouseInfo"
              label="Continue"
              intent="primary"
              onPress={() =>
                app.update((s) => ({
                  ...s,
                  screen: "intro",
                }))
              }
            />
          </rezi.Row>
        </rezi.Box>
      </rezi.Box>
    </rezi.Box>
  );
}

function IntroScreen({ state }: { state: State }) {
  return (
    <rezi.Column
      width="full"
      height="full"
      gap={1}
      items="center"
      align="center"
      pl={1}
      pr={1}
    >
      <rezi.Box width={25} height={7}>
        {state.logo.map((line, i) => (
          <rezi.Text key={String(i)}>
            {line.replaceAll(" ", "\u00A0")}
          </rezi.Text>
        ))}
      </rezi.Box>

      <rezi.Text variant="heading">Blacksmith</rezi.Text>
      <rezi.Text variant="heading">
        Framework Design • System Architecture • Codebase Scalability
      </rezi.Text>

      <rezi.Button
        id="continueFromIntro"
        label="Continue"
        intent="primary"
        onPress={() =>
          app.update((s) => ({
            ...s,
            screen: "home",
          }))
        }
      />
    </rezi.Column>
  );
}

function renderSection(input: number) {
  const key = Section.getKey(input);
  const sectionArr = key ? Section.fetch(key) : null;

  if (!sectionArr || sectionArr.isErr()) {
    return (
      <rezi.Box width="full" height="full" px={1}>
        <rezi.Text>
          An error occured trying to fetch section:{" "}
          {sectionArr ? sectionArr.error.type : "none"}
        </rezi.Text>
        <rezi.Text wrap>
          VALUE: {sectionArr ? sectionArr.error.key : "none"}
        </rezi.Text>
      </rezi.Box>
    );
  } else {
    return <sectionArr.value.component />;
  }
}

function HomeScreen({ state }: { state: State }) {
  return (
    <rezi.Column width="full" height="full" gap={1}>
      <rezi.Box flex={1} width="full" border="rounded">
        <rezi.Column align="center">
          <rezi.Row>
            {Section.list.map((data) => (
              <rezi.Box
                px={2}
                borderStyle={{
                  dim: Section.getKey(state.section) !== data.key,
                }}
                border="rounded"
              >
                <rezi.Row>
                  <rezi.Text>[{data.keybind}]</rezi.Text>
                  <rezi.Text
                    style={{
                      dim: Section.getKey(state.section) !== data.key,
                    }}
                  >
                    {data.title}
                  </rezi.Text>
                </rezi.Row>
              </rezi.Box>
            ))}
          </rezi.Row>

          {renderSection(state.section)}
        </rezi.Column>
      </rezi.Box>
    </rezi.Column>
  );
}

function UnknownScreen() {
  return (
    <rezi.Box border="none" width="full" height="full" alignSelf="center">
      <rezi.Box title="Invalid Screen" width="full" height="full" px={2} py={1}>
        <rezi.Box width="full" height="full" border="none" minWidth={50}>
          <rezi.Text>
            The screen you've been trying to access does not exist.
          </rezi.Text>
          <rezi.Text>
            │ If you want to default back to the intro screen.
          </rezi.Text>
          <rezi.Text>└ Press, Continue.</rezi.Text>

          <rezi.Spacer flex={1} />

          <rezi.Row gap={1}>
            <rezi.Button
              id="continueFromMouseInfo"
              label="Continue"
              intent="primary"
              onPress={() =>
                app.update((s) => ({
                  ...s,
                  screen: "intro",
                }))
              }
            />
          </rezi.Row>
        </rezi.Box>
      </rezi.Box>
    </rezi.Box>
  );
}

app.view((state) => (
  <rezi.Page
    p={1}
    gap={1}
    body={
      <rezi.Box border="none" width="full" height="full">
        {state.screen === "mouseinfo" ? (
          <MouseInfoScreen />
        ) : state.screen === "intro" ? (
          <IntroScreen state={state} />
        ) : state.screen === "home" ? (
          <HomeScreen state={state} />
        ) : (
          <UnknownScreen />
        )}
      </rezi.Box>
    }
  />
));

app.keys({
  q: () => app.stop(),
  escape: () =>
    app.update((s) => ({
      ...s,
      screen: "intro",
    })),

  left: () =>
    app.update((s) => ({
      ...s,
      section: Math.max(0, s.section - 1),
    })),

  right: () =>
    app.update((s) => ({
      ...s,
      section: Math.min(Section.list.length - 1, s.section + 1),
    })),

  w: () => {
    app.update((s) => ({
      ...s,
      section: 0,
    }));
  },

  t: () =>
    app.update((s) => ({
      ...s,
      section: 1,
    })),
});

await app.start();
