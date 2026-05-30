#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';

const ink = render(<App />);

console.log('start', process.stdout.columns, process.stdout.rows);

process.stdout.on('resize', () => {
	console.log('resize', process.stdout.columns, process.stdout.rows);
});

setInterval(() => {}, 1000);

process.stdout.on('resize', () => {
	ink.rerender(<App />);
});
