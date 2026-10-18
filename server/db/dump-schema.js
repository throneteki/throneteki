/*eslint no-console: 0*/
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

const UnstableLines = [
    /^-- Dumped (from|by) /,
    /^\\(un)?restrict /,
    /^SET transaction_timeout = /,
    /^SET client_encoding = /
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
    if (!input.trim()) {
        console.error('No pg_dump output received on stdin');
        process.exitCode = 1;

        return;
    }

    const output = input
        .replace(/\r\n/g, '\n')
        .split('\n')
        .filter((line) => !UnstableLines.some((pattern) => pattern.test(line)))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    fs.writeFileSync(path.join(__dirname, 'schema.sql'), output + '\n');
});
