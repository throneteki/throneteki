// Screenshots of the game board's dev fixtures at the reference screen sizes, with a report of anything that
// scrolls. Needs the dev server running (npm start).
//
//   npm run board:shots
//   npm run board:shots -- --board=adaptive --fixture=crowded --size=phone-portrait
//
// Images go to testoutput/board-shots/<board>-<size>-<fixture>.png. Set BOARD_URL for another server.
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { boardFixtures } from '../../client/dev/boardFixtures.js';

const sizes = {
    'phone-portrait': { width: 390, height: 844, isMobile: true, hasTouch: true },
    'phone-landscape': { width: 844, height: 390, isMobile: true, hasTouch: true },
    'tablet-portrait': { width: 820, height: 1180, isMobile: true, hasTouch: true },
    'tablet-landscape': { width: 1180, height: 820, isMobile: true, hasTouch: true },
    desktop: { width: 1600, height: 950, isMobile: false, hasTouch: false }
};
const boards = ['adaptive', 'classic'];

const option = (name) =>
    process.argv
        .find((arg) => arg.startsWith(`--${name}=`))
        ?.split('=')[1]
        ?.split(',');

const pick = (all, name) => {
    const wanted = option(name);
    const unknown = wanted?.filter((value) => !all.includes(value)) || [];
    if (unknown.length > 0) {
        throw new Error(`Unknown ${name}: ${unknown.join(', ')}. Known: ${all.join(', ')}`);
    }
    return wanted || all;
};

const base = process.env.BOARD_URL || 'http://localhost:4000';
const outDir = path.resolve('testoutput/board-shots');
// The board holds animations while it first fills in, and staged arrivals deal the hand in
const settleMs = 2200;

// Anything on the page that scrolls, or is cut off where it should scroll: the page itself and every
// element whose content is bigger than its box and that lets it scroll
const findOverflow = () => {
    const results = [];
    const page = document.scrollingElement;
    if (page.scrollHeight > window.innerHeight + 1 || page.scrollWidth > window.innerWidth + 1) {
        results.push({ what: 'page', scroll: [page.scrollWidth, page.scrollHeight] });
    }
    for (const element of document.querySelectorAll('body *')) {
        const style = getComputedStyle(element);
        const scrolls = (value) => ['auto', 'scroll'].includes(value);
        const x = scrolls(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
        const y = scrolls(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
        if ((x || y) && element.clientHeight > 0 && !element.closest('.chat-drawer')) {
            results.push({
                what:
                    element.dataset.region ||
                    element.getAttribute('data-layout') ||
                    `${element.tagName.toLowerCase()}.${[...element.classList].slice(0, 3).join('.')}`,
                axis: [x && 'x', y && 'y'].filter(Boolean).join(''),
                box: [element.clientWidth, element.clientHeight],
                content: [element.scrollWidth, element.scrollHeight]
            });
        }
    }
    // The adaptive board never scrolls, so content too big for a region is cut off instead: report that too.
    // Only where the region hides what spills out; spilling visibly over its neighbours is not cut off.
    const clipped = [];
    const hides = (value) => ['hidden', 'clip'].includes(value);
    for (const element of document.querySelectorAll('[data-layout], [data-region]')) {
        const style = getComputedStyle(element);
        const x = hides(style.overflowX) && element.scrollWidth > element.clientWidth + 2;
        const y = hides(style.overflowY) && element.scrollHeight > element.clientHeight + 2;
        if (x || y) {
            clipped.push({
                what: element.dataset.region || 'board',
                axis: [x && 'x', y && 'y'].filter(Boolean).join(''),
                box: [element.clientWidth, element.clientHeight],
                content: [element.scrollWidth, element.scrollHeight]
            });
        }
    }
    return {
        layout: document.documentElement.dataset.boardLayout || null,
        overflow: results,
        clipped
    };
};

const describeClip = (clip) =>
    `${clip.what}(${clip.axis} ${clip.content.join('x')} in ${clip.box.join('x')})`;

// The dev server restarts when its files change, so a page that cannot be reached is tried again
const load = async (page, url, attempts = 5) => {
    for (let attempt = 1; ; attempt++) {
        try {
            await page.goto(url, { waitUntil: 'networkidle' });
            return;
        } catch (error) {
            if (attempt >= attempts || !/ERR_CONNECTION|ECONNREFUSED/.test(error.message)) {
                throw error;
            }
            await page.waitForTimeout(2000);
        }
    }
};

const run = async () => {
    const chosenBoards = pick(boards, 'board');
    const chosenSizes = pick(Object.keys(sizes), 'size');
    const chosenFixtures = pick(Object.keys(boardFixtures), 'fixture');
    fs.mkdirSync(outDir, { recursive: true });

    const browser = await chromium.launch();
    const report = [];
    try {
        for (const sizeName of chosenSizes) {
            const { width, height, ...device } = sizes[sizeName];
            const context = await browser.newContext({
                viewport: { width, height },
                deviceScaleFactor: 1,
                ...device
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('console', (message) => {
                if (message.type() === 'error') {
                    errors.push(message.text());
                }
            });

            for (const board of chosenBoards) {
                for (const fixture of chosenFixtures) {
                    errors.length = 0;
                    const url = `${base}/dev/board?fixture=${fixture}&board=${board}&panel=0`;
                    await load(page, url);
                    await page.waitForSelector('[data-card-surface]', { timeout: 15000 });
                    await page.waitForTimeout(settleMs);

                    const file = path.join(outDir, `${board}-${sizeName}-${fixture}.png`);
                    await page.screenshot({ path: file });
                    const found = await page.evaluate(findOverflow);
                    report.push({
                        board,
                        size: sizeName,
                        fixture,
                        layout: found.layout,
                        overflow: found.overflow,
                        clipped: found.clipped,
                        errors: [...new Set(errors)].filter(
                            (text) =>
                                !/Failed to load resource|favicon|socket|websocket/i.test(text)
                        ),
                        file: path.relative(process.cwd(), file)
                    });
                }
            }
            await context.close();
        }
    } finally {
        await browser.close();
    }

    for (const entry of report) {
        const flags = [
            entry.layout && `layout=${entry.layout}`,
            entry.overflow.length > 0
                ? `SCROLLS: ${entry.overflow.map((o) => `${o.what}(${o.axis || 'page'})`).join(', ')}`
                : 'no scrolling',
            entry.clipped.length > 0 && `CLIPPED: ${entry.clipped.map(describeClip).join(', ')}`,
            entry.errors.length > 0 && `ERRORS: ${entry.errors.join(' | ')}`
        ].filter(Boolean);
        console.log(`${entry.board} ${entry.size} ${entry.fixture}: ${flags.join('; ')}`);
    }
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`\n${report.length} screenshots in ${path.relative(process.cwd(), outDir)}`);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
