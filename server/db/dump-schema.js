/*eslint no-console: 0*/
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

// Reads `pg_dump --schema-only` output on stdin and writes it to server/db/schema.sql without the
// lines that change between runs or server versions, so the file only changes when the schema does.
const UnstableLines = [
    /^-- Dumped (from|by) /,
    /^\\(un)?restrict /, // random per-dump key added in pg_dump 17.6 / 16.10
    /^SET transaction_timeout = /,
    /^SET client_encoding = / // follows the server's encoding, which differs between machines
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
