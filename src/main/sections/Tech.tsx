import * as rezi from "@rezi-ui/jsx";
import type { TextStyle } from "@rezi-ui/jsx";

type Skill =
  | "Beginner"
  | "Advanced Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

type StackModal = {
  title?: string;
  description: string;
};

type StackItem = {
  title: string;
  skill?: Skill;
  description?: string;
  modal?: StackModal;
  titleStyle?: TextStyle;
  skillStyle?: TextStyle;
  descStyle?: TextStyle;
};

type Stack = StackItem[];

const stack: Stack = [
  {
    title: "Stack",
    titleStyle: {
      bold: true,
      bg: 207234,
    },
    modal: {
      title: "Stack",
      description: "This section lists my main languages and frameworks.",
    },
  },
  {
    title: "Luau",
    skill: "Advanced",
    modal: {
      title: "Luau",
      description: "Comfortable building larger Luau codebases and systems.",
    },
  },
  {
    title: "VueJs",
    skill: "Advanced",
    modal: {
      title: "VueJs",
      description: "Strong with component architecture and production UI work.",
    },
  },
  {
    title: "TypeScript",
    skill: "Intermediate",
    modal: {
      title: "TypeScript",
      description:
        "Can build independently and adapt well across app codebases.",
    },
  },
  {
    title: "Rust",
    skill: "Advanced Beginner",
    modal: {
      title: "Rust",
      description:
        "Can read, modify, and build smaller features with docs nearby.",
    },
  },
  {
    title: "C++",
    skill: "Advanced Beginner",
    modal: {
      title: "C++",
      description: "Can extend existing code with guidance and references.",
    },
  },
  {
    title: "Python",
    skill: "Advanced Beginner",
    modal: {
      title: "Python",
      description:
        "Useful for scripts and tooling, with docs for bigger systems.",
    },
  },
  {
    title: "Beginner",
    description:
      "I need guidance to start, but I can learn fast from documentation.",
    titleStyle: {
      bold: true,
    },
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Beginner",
      description:
        "I need guidance to start, but I can ramp up quickly from docs and examples.",
    },
  },
  {
    title: "Advanced Beginner",
    description:
      "I can follow and modify code, but I rely on documentation to build from scratch.",
    titleStyle: {
      bold: true,
    },
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Advanced Beginner",
      description:
        "I can follow and modify code, but I still rely on documentation to start from zero.",
    },
  },
  {
    title: "Intermediate",
    description:
      "I can build independently and adapt quickly in most codebases.",
    titleStyle: {
      bold: true,
    },
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Intermediate",
      description:
        "I can build independently, solve common problems, and adapt quickly in most codebases.",
    },
  },
  {
    title: "Advanced",
    description:
      "I can design solid systems and make strong architecture decisions.",
    titleStyle: {
      bold: true,
    },
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Advanced",
      description:
        "I can design solid systems, make strong architecture decisions, and structure larger work confidently.",
    },
  },
  {
    title: "Expert",
    description: "I can lead, teach, and solve uncommon problems.",
    titleStyle: {
      bold: true,
    },
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Expert",
      description:
        "I can lead, teach, and solve uncommon technical problems with confidence.",
    },
  },
  {
    title: "Tools",
    titleStyle: {
      bold: true,
      bg: 542323,
    },
    modal: {
      title: "Tools",
      description: "These are the tools I use most often in my workflow.",
    },
  },
  {
    title: "Figma",
    description: "My primary tool for UI/UX development.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Figma",
      description:
        "My main tool for interface design, layout planning, and UI/UX work.",
    },
  },
  {
    title: "Zed Editor",
    description: "My primary tool for developing software.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Zed Editor",
      description: "My main editor for writing and navigating code.",
    },
  },
  {
    title: "GitHub",
    description: "My primary tool for repositories.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "GitHub",
      description:
        "My main tool for repositories, version control, and collaboration.",
    },
  },
  {
    title: "Operating Systems",
    titleStyle: {
      bold: true,
      bg: 812323,
    },
    modal: {
      title: "Operating Systems",
      description: "These are the operating systems I work with most often.",
    },
  },
  {
    title: "Windows",
    description: "My primary OS for Window's API Development.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Windows",
      description:
        "My primary OS for Windows API and platform-specific development.",
    },
  },
  {
    title: "Arch Linux",
    description: "My primary OS for daily development and usage.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Arch Linux",
      description: "My main OS for daily development and general use.",
    },
  },
  {
    title: "Ubuntu",
    description: "My primary OS for setting up a server.",
    descStyle: {
      dim: true,
    },
    modal: {
      title: "Ubuntu",
      description: "My go-to OS for server setup and deployment tasks.",
    },
  },
];

export function getStackItem(index: number): StackItem | undefined {
  return stack[index];
}

export function getStackLength(): number {
  return stack.length;
}

export default function Tech({ state }: SectionProps) {
  return (
    <rezi.Column width="full" height="full" align="center" gap={0}>
      <rezi.VirtualList
        id="VirtualList"
        width="full"
        height="full"
        items={stack}
        itemHeight={2}
        overscan={2}
        focusable={false}
        keyboardNavigation={false}
        selectionStyle={{}}
        focusConfig={{ indicator: "none" }}
        ensureVisibleIndex={state.techSelectedIndex}
        ensureVisibleMode="always"
        renderItem={(item: StackItem, index: number) => (
          <rezi.Row
            width="full"
            gap={1}
            px={2}
            style={index === state.techSelectedIndex ? { inverse: true } : {}}
          >
            <rezi.Text style={item.titleStyle ?? {}}>{item.title}</rezi.Text>
            {item.skill && <rezi.Text>•</rezi.Text>}
            {item.skill && (
              <rezi.Text style={item.skillStyle ?? {}}>{item.skill}</rezi.Text>
            )}
            {item.description && <rezi.Text>•</rezi.Text>}
            {item.description && (
              <rezi.Text textOverflow="ellipsis" style={item.descStyle ?? {}}>
                {item.description}
              </rezi.Text>
            )}
          </rezi.Row>
        )}
      />
    </rezi.Column>
  );
}
