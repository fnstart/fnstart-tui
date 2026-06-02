import * as rezi from "@rezi-ui/jsx";

export default function IntroScreen({ app, state, route }: PageComponent) {
  return (
    <rezi.Center>
      <rezi.Column gap={1} items="center" align="center">
        <rezi.Box width={25} height={7}>
          {state.logo.map((line, i) => (
            <rezi.Text key={String(i)}>
              {line.replaceAll(" ", "\u00A0")}
            </rezi.Text>
          ))}
        </rezi.Box>

        <rezi.Text variant="heading">Blacksmith</rezi.Text>
        <rezi.Text wrap>
          Framework Design • System Architecture • Codebase Scalability
        </rezi.Text>

        <rezi.Button
          id="continueFromIntro"
          label="Continue"
          intent="primary"
          onPress={() => (route.page = "Home")}
        />
      </rezi.Column>
    </rezi.Center>
  );
}
