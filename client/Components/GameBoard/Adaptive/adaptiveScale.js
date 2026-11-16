export const layoutModes = ['narrow', 'short', 'wide'];

const thresholds = { narrowAspect: 0.9, narrowWidth: 900, shortHeight: 560 };
const hysteresis = { aspect: 0.05, px: 40 };

const isNarrow = ({ width, height }, slack) =>
    width / height < thresholds.narrowAspect + slack * hysteresis.aspect &&
    width < thresholds.narrowWidth + slack * hysteresis.px;
const isShort = ({ width, height }, slack) =>
    width >= height && height < thresholds.shortHeight + slack * hysteresis.px;
const modeTests = { narrow: isNarrow, short: isShort };

// A board near a boundary keeps the mode it has, so resizing across the line does not flip it back and forth
export const classifyLayout = (size, previous) => {
    if (!size?.width || !size?.height) {
        return previous ?? 'wide';
    }
    if (modeTests[previous]?.(size, 1)) {
        return previous;
    }

    const slack = previous ? -1 : 0;
    if (isNarrow(size, slack)) {
        return 'narrow';
    }
    if (isShort(size, slack)) {
        return 'short';
    }
    return 'wide';
};

const kneeledWidth = 5.6 / 4;

const rowOf = (card) => {
    if (card.type === 'location') {
        return 'location';
    }
    return ['character', 'attachment'].includes(card.type) ? 'character' : 'other';
};

// How wide the widest row in play is, in card widths: a kneeling card lies on its side and takes more room
export const widestRowUnits = (players) => {
    let widest = 0;
    for (const player of players || []) {
        const rows = {};
        for (const card of player?.cardPiles?.cardsInPlay || []) {
            const row = rowOf(card);
            rows[row] = (rows[row] || 0) + (card.kneeled ? kneeledWidth : 1);
        }
        widest = Math.max(widest, ...Object.values(rows));
    }
    return widest;
};

// Space at card scale 1, in rem
const card = { width: 4, height: 5.6 };
const gapRem = 0.375;

// What each mode stacks vertically and lines up horizontally. Rows are counted in card heights, strips in card
// widths at pile scale (at card scale where pilesAtCardSize); chrome is the space taken by bars, the prompt and rails, in rem.
export const layoutBudgets = {
    narrow: {
        pileRatio: 0.7,
        handRatio: 1.1,
        baseline: 1.6,
        min: 0.85,
        max: 1.6,
        rows: { play: 4, pile: 2, hand: 1 },
        stripUnits: 9,
        chrome: { width: 1, height: 7 }
    },
    short: {
        pileRatio: 0.7,
        handRatio: 1.1,
        baseline: 0.9,
        min: 0.7,
        max: 1.4,
        rows: { play: 4, pile: 0, hand: 0.4 },
        stripUnits: 0,
        chrome: { width: 26, height: 1.5 }
    },
    wide: {
        pilesAtCardSize: true,
        pileRatio: 1,
        handRatio: 1,
        baseline: 1,
        min: 0.8,
        max: 2.5,
        rows: { play: 4, pile: 2, hand: 0 },
        stripUnits: 13,
        chrome: { width: 18, height: 6 }
    }
};

const scaleStep = 0.05;
const absoluteMin = 0.3;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toStep = (value) => Math.round(Math.floor(value / scaleStep + 1e-9) * scaleStep * 100) / 100;

// The play areas never push the board past the screen's height. A wide row only shrinks the cards down to the
// smallest readable size for the mode; past that the row overlaps its cards instead.
export const computeAdaptiveScales = ({
    mode,
    width,
    height,
    rem = 16,
    widestRow = 0,
    cardsSize = 1
}) => {
    const budget = layoutBudgets[mode] || layoutBudgets.wide;
    const cardWidth = card.width * rem;
    const cardHeight = card.height * rem;
    const gap = gapRem * rem;

    const heightUnits =
        budget.rows.play +
        budget.rows.pile * budget.pileRatio +
        budget.rows.hand * budget.handRatio;
    const rowCount = budget.rows.play + budget.rows.pile + Math.ceil(budget.rows.hand);
    const freeHeight = height - budget.chrome.height * rem - rowCount * gap;
    const heightFit = freeHeight / (heightUnits * cardHeight);

    const freeWidth = width - budget.chrome.width * rem;
    // The largest pile scale at which a strip of piles fits across the board
    const stripPileFit =
        budget.stripUnits > 0
            ? (freeWidth - budget.stripUnits * gap) / (budget.stripUnits * cardWidth)
            : Infinity;
    const rowFit =
        widestRow > 0 ? (freeWidth - widestRow * gap) / (widestRow * cardWidth) : Infinity;

    // Where piles are drawn at the board's card size, a strip too wide for the board makes every card smaller;
    // elsewhere the piles shrink on their own and the play areas keep their size
    const stripLimit = budget.pilesAtCardSize ? stripPileFit : Infinity;
    const wanted = Math.min(budget.baseline * cardsSize, budget.max);
    const fitted = Math.min(wanted, heightFit, stripLimit, Math.max(rowFit, budget.min));
    const scale = toStep(clamp(fitted, absoluteMin, budget.max));
    const pile = budget.pilesAtCardSize ? scale : Math.min(scale * budget.pileRatio, stripPileFit);

    return {
        card: scale,
        pile: toStep(Math.max(pile, absoluteMin)),
        hand: toStep(Math.max(scale * budget.handRatio, absoluteMin))
    };
};
