import * as rezi from "@rezi-ui/jsx";

export default function MouseInfoScreen({ app, route }: PageComponent) {
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
              onPress={() => {
                route.page = "Introduction";
              }}
            />
          </rezi.Row>
        </rezi.Box>
      </rezi.Box>
    </rezi.Box>
  );
}
