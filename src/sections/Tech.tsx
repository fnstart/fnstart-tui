import * as rezi from "@rezi-ui/jsx";

export default function Component() {
  return (
    <rezi.Column width="full" pt={1}>
      <rezi.Row width="full" gap={1}>
        <rezi.Text>Rust</rezi.Text>
      </rezi.Row>
      <rezi.Box width="full" height={3} border="rounded" px={2}>
        <rezi.BarChart
          data={[
            { label: "TypeScript", value: 5 },
            { label: "JavaScript", value: 5 },
          ]}
        />
      </rezi.Box>
    </rezi.Column>
  );
}
