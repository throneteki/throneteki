import fs from 'fs';
import path from 'path';

// The board follows the site's colours and type (docs/design.md): Tailwind's default palette, HeroUI 2's greys, black
// panel fills and all-capitals labels each have a site token or style instead. Counters and card placeholders are
// coloured as game content, so they are left out.
const boardDir = 'client/Components/GameBoard';
const gameContent = ['Counter.jsx', 'CardSkeleton.jsx'];
const offPalette = [
    /\b(bg|text|border|ring|from|via|to|shadow|outline|fill|stroke)-(amber|yellow|orange|zinc|gray|slate|stone|neutral|sky|blue|indigo|red|rose|emerald|green|lime|teal|cyan|purple|violet)-[0-9]{2,3}\b/,
    /\b(bg|text|border|ring)-default-[0-9]{2,3}\b/,
    /\bbg-black\/[6-9][0-9]\b/,
    /(?<![:-])\buppercase\b/,
    /\bfont-\[Cinzel/
];

const sourceFiles = (dir) =>
    fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap((entry) =>
            entry.isDirectory()
                ? sourceFiles(path.join(dir, entry.name))
                : /\.jsx?$/.test(entry.name) && !gameContent.includes(entry.name)
                  ? [path.join(dir, entry.name)]
                  : []
        );

// The panels round the board follow the site's theme, so their tints come from the theme too (edge, quiet, panel)
// rather than white or black, which only suit the dark surface
const panels = [
    'Adaptive/chipClass.js',
    'Adaptive/GameMenu.jsx',
    'Adaptive/PlayerStatsBar.jsx',
    'Adaptive/PromptBar.jsx',
    'Adaptive/SheetHost.jsx',
    'Adaptive/SpectatorList.jsx',
    'ActivePlayerPrompt.jsx',
    'CardPile.jsx',
    'Classic/PlayerStats.jsx',
    'GameChat.jsx',
    'MovablePanel.jsx',
    'StatContainer.jsx',
    'StatDisplay.jsx',
    'WaitingChip.jsx'
];
const themeless = [/\btext-white\b/, /\b(bg|border|text|ring)-(white|black)\/[0-9[]/];

describe('the game board palette', () => {
    it('draws the panels with theme tints', () => {
        const found = [];
        for (const name of panels) {
            const file = path.join(boardDir, name);
            const lines = fs.readFileSync(file, 'utf8').split('\n');
            lines.forEach((line, index) => {
                for (const pattern of themeless) {
                    const match = line.match(pattern);
                    if (match) {
                        found.push(`${file}:${index + 1} ${match[0]}`);
                    }
                }
            });
        }

        expect(found).toEqual([]);
    });

    it('uses the site tokens rather than off-palette classes', () => {
        const found = [];
        for (const file of sourceFiles(boardDir)) {
            const lines = fs.readFileSync(file, 'utf8').split('\n');
            lines.forEach((line, index) => {
                for (const pattern of offPalette) {
                    const match = line.match(pattern);
                    if (match) {
                        found.push(`${file}:${index + 1} ${match[0]}`);
                    }
                }
            });
        }

        expect(found).toEqual([]);
    });
});
