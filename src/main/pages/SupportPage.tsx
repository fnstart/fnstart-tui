import * as rezi from "@rezi-ui/jsx";

export default function SupportPage({ state, route }: PageComponent) {
  return (
    <rezi.Box border="none" width="full" height="full" alignSelf="center">
      <rezi.Box title="Support" width="full" height="full" px={2} py={1}>
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

          <rezi.Box height={1} />

          <rezi.Text>Controls:</rezi.Text>
          <rezi.Text>├ Enter: Continue to the next screen.</rezi.Text>
          <rezi.Text>├ Escape: Go back.</rezi.Text>
          <rezi.Text>
            ├ Tab: Focus the next control or the first row in a list.
          </rezi.Text>
          <rezi.Text>├ Left / Right: Switch sections in Home.</rezi.Text>
          <rezi.Text>├ W: Jump to Welcome.</rezi.Text>
          <rezi.Text>├ T: Jump to Tech.</rezi.Text>
          <rezi.Text>└ Ctrl+C: Return to this help screen.</rezi.Text>

          <rezi.Box height={1} />

          <rezi.Text>Lists:</rezi.Text>
          <rezi.Text>├ Press Tab to enter a virtual list.</rezi.Text>
          <rezi.Text>├ Use Up / Down to move between rows.</rezi.Text>
          <rezi.Text>
            └ Press Enter to open or select the focused row.
          </rezi.Text>

          <rezi.Spacer flex={1} />

          <rezi.Row gap={1}>
            <rezi.Text>Press Enter to continue.</rezi.Text>
          </rezi.Row>
        </rezi.Box>
      </rezi.Box>
    </rezi.Box>
  );
}
