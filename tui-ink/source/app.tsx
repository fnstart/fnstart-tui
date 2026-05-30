import React from 'react';
import {Text, Box, useStdout} from 'ink';

export default function App() {
	const {stdout} = useStdout();
	const columns = stdout.columns ?? 80;

	return (
		<Box>
			<Box flexWrap="wrap" width="100%">
				<Box borderStyle="round" paddingLeft={1}>
					<Text bold>github.com/fnstart </Text>
				</Box>
				<Box
					width="90%"
					borderStyle="classic"
					paddingLeft={1}
					paddingRight={1}
					gap={2}
				>
					<Text>
						Framework Design • System Architecture • Codebase Scalability
					</Text>
					<Text>{columns}</Text>
				</Box>
			</Box>
		</Box>
	);
}
