import * as rezi from "@rezi-ui/jsx";

export default function Component() {
  return (
    <rezi.Column
      width="full"
      height="full"
      align="center"
      justify="center"
      gap={0}
    >
      <rezi.Text textOverflow="ellipsis" variant="heading">
        Hello, I'm referred as the person called Blacksmith or @fnstart.
      </rezi.Text>
      <rezi.Text textOverflow="ellipsis">
        ?: Here I tell you about my most recent discoveries or projects.
      </rezi.Text>
      <rezi.Text textOverflow="ellipsis">
        !: Making this wasn't hard nor easy, just a lot of workarounds.
      </rezi.Text>

      <rezi.Box border="single" width="full" height={3} px={1}>
        <rezi.MiniChart
          width="full"
          variant="bars"
          values={[
            { label: "TypeScript", value: 90, max: 100 },
            { label: "Go", value: 70, max: 100 },
            { label: "Rust", value: 55, max: 100 },
          ]}
        />
      </rezi.Box>
    </rezi.Column>
  );
}
