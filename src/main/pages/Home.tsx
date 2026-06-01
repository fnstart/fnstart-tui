import * as rezi from "@rezi-ui/jsx";
import { Result } from "better-result";

import Welcome from "@/main/sections/Welcome";
import Tech from "@/main/sections/Tech";

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

function renderSection(input: number, app: NodeApp<State>, state: State) {
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
          VALUE: {sectionArr ? String(sectionArr.error.key) : "none"}
        </rezi.Text>
      </rezi.Box>
    );
  } else {
    return <sectionArr.value.component app={app} state={state} />;
  }
}

export default function HomeScreen({ app, state }: PageComponent) {
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

          {renderSection(state.section, app, state)}
        </rezi.Column>
      </rezi.Box>
    </rezi.Column>
  );
}
