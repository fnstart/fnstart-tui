import * as rezi from "@rezi-ui/jsx";
import type { TextStyle } from "@rezi-ui/jsx";
type Skill =
  | "Beginner"
  | "Advanced Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

type StackItem = {
  title: string;
  skill?: Skill;
  description?: string;
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
  },
  {
    title: "Luau",
    skill: "Advanced",
  },
  {
    title: "VueJs",
    skill: "Advanced",
  },
  {
    title: "TypeScript",
    skill: "Intermediate",
  },
  {
    title: "Rust",
    skill: "Advanced Beginner",
  },
  {
    title: "C++",
    skill: "Advanced Beginner",
  },
  {
    title: "Python",
    skill: "Advanced Beginner",
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
  },
  {
    title: "Tools",
    titleStyle: {
      bold: true,
      bg: 542323,
    },
  },
  {
    title: "Figma",
    description: "My primary tool for UI/UX development.",
    descStyle: {
      dim: true,
    },
  },
  {
    title: "Zed Editor",
    description: "My primary tool for developing software.",
    descStyle: {
      dim: true,
    },
  },
  {
    title: "GitHub",
    description: "My primary tool for repositories.",
    descStyle: {
      dim: true,
    },
  },
  {
    title: "Operating Systems",
    titleStyle: {
      bold: true,
      bg: 812323,
    },
  },
  {
    title: "Windows",
    description: "My primary OS for Window's API Development.",
    descStyle: {
      dim: true,
    },
  },
  {
    title: "Arch Linux",
    description: "My primary OS for daily development and usage.",
    descStyle: {
      dim: true,
    },
  },
  {
    title: "Ubuntu",
    description: "My primary OS for setting up a server.",
    descStyle: {
      dim: true,
    },
  },
];

export default function Component() {
  return (
    <rezi.Column width="full" height="full" align="center" gap={0}>
      <rezi.VirtualList
        id="VirtualList"
        width="full"
        height="full"
        items={stack}
        itemHeight={2}
        overscan={2}
        renderItem={({
          title,
          skill,
          description,
          titleStyle,
          skillStyle,
          descStyle,
        }) => (
          <rezi.Row width="full" gap={1} px={2}>
            <rezi.Text style={titleStyle ? titleStyle : {}}>{title}</rezi.Text>
            {skill && <rezi.Text>•</rezi.Text>}
            {skill && (
              <rezi.Text style={skillStyle ? skillStyle : {}}>
                {skill}
              </rezi.Text>
            )}
            {description && <rezi.Text>•</rezi.Text>}
            {description && (
              <rezi.Text
                textOverflow="ellipsis"
                style={descStyle ? descStyle : {}}
              >
                {description}
              </rezi.Text>
            )}
          </rezi.Row>
        )}
      />
    </rezi.Column>
  );
}
