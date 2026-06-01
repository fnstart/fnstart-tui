import * as rezi from "@rezi-ui/jsx";

export default function UnknownScreen({ app }: PageComponent) {
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
