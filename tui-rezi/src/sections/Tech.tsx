import * as rezi from "@rezi-ui/jsx";

export default function Component() {
  return (
    <rezi.Column width="full" pt={1}>
      <rezi.Row width="full" gap={1}>
        <rezi.Text>Rust</rezi.Text>
      </rezi.Row>
      <rezi.Box border="single" width={30} height={8} p={1}>
        <rezi.MiniChart
          width={24}
          height={4}
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
