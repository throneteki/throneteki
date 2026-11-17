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

// The piles a player's strip shows only while they hold cards, and how many card widths each adds
const optionalPiles = [
    { units: 1.5, holds: (player) => player?.cardPiles?.shadows?.length > 0 },
    { units: 1.4, holds: (player) => player?.cardPiles?.outOfGamePile?.length > 0 },
    { units: 1, holds: (player) => !!player?.title },
    { units: 0.35, holds: (player) => player?.agendas?.length > 1 }
];

// How much wider than its base the widest strip is, in card widths
export const stripExtraUnits = (players) =>
    Math.max(
        0,
        ...(players || []).map((player) =>
            optionalPiles.reduce((sum, pile) => sum + (pile.holds(player) ? pile.units : 0), 0)
        )
    );

// Space at card scale 1, in rem
const card = { width: 4, height: 5.6 };
const gapRem = 0.375;
// A row holding a card with attachments stands taller than one card, by about this many cards
const attachmentAllowance = 0.1;
// Each play area's margin, top and bottom, for both players
const playMarginRem = 2;

// What each mode stacks vertically and lines up horizontally. Rows are counted in card heights, strips in card
// widths at pile scale (at card scale where pilesAtCardSize), before the optional piles (stripExtraUnits). Chrome is the space taken by the prompt divider,
// side columns and padding, in rem. Cards grow to fill the room, up to max, and shrink for a wide row only to
// min before the row overlaps its cards instead.
export const layoutBudgets = {
    narrow: {
        pileRatio: 0.7,
        handRatio: 1.1,
        min: 0.85,
        max: 1.8,
        // Every pile in the strips is drawn at one size: as large as lets our strip (which has no opponent's hand
        // in it, so is one card narrower) fit on one line, within pileMin and pileCap. A strip that is still too
        // wide wraps onto a second line.
        pileMin: 0.7,
        pileCap: 0.8,
        ourStripLess: 1,
        rows: { play: 4, pile: 2, hand: 1 },
        stripUnits: 7.5,
        chrome: { width: 1, height: 6.5 }
    },
    short: {
        pileRatio: 0.7,
        handRatio: 1.1,
        min: 0.7,
        max: 1.6,
        rows: { play: 4, pile: 0, hand: 0.4 },
        stripUnits: 0,
        chrome: { width: 14, height: 4.25 }
    },
    wide: {
        pilesAtCardSize: true,
        pileRatio: 1,
        handRatio: 1,
        min: 0.8,
        max: 2,
        rows: { play: 4, pile: 2, hand: 0 },
        stripUnits: 11.5,
        chrome: { width: 2, height: 4 }
    }
};

const scaleStep = 0.05;
const absoluteMin = 0.3;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toStep = (value) => Math.round(Math.floor(value / scaleStep + 1e-9) * scaleStep * 100) / 100;

// The play areas never push the board past the screen's height. A chosen card size below normal makes them
// smaller than the room allows; above normal there is no room to grow into.
const fitScales = (
    { mode, width, height, rem = 16, widestRow = 0, cardsSize = 1, stripExtra = 0 },
    pileCap
) => {
    const budget = layoutBudgets[mode] || layoutBudgets.wide;
    const cardWidth = card.width * rem;
    const cardHeight = card.height * rem;
    const gap = gapRem * rem;

    const freeWidth = width - budget.chrome.width * rem;
    // The largest pile scale at which a strip of piles fits across the board
    const stripPileFit =
        budget.stripUnits > 0
            ? (freeWidth - (budget.stripUnits + stripExtra) * gap) /
              ((budget.stripUnits + stripExtra) * cardWidth)
            : Infinity;

    // Piles with a size of their own take their strips' height first; the play areas fit the rest
    let ownPile = null;
    let pileLines = budget.rows.pile;
    if (!budget.pilesAtCardSize && budget.pileMin) {
        const units = budget.stripUnits + stripExtra;
        const fitFor = (stripUnits) => (freeWidth - stripUnits * gap) / (stripUnits * cardWidth);
        ownPile = clamp(
            fitFor(units - budget.ourStripLess),
            budget.pileMin,
            pileCap ?? budget.pileCap
        );
        const linesFor = (stripUnits) => (fitFor(stripUnits) >= ownPile - 1e-9 ? 1 : 2);
        pileLines = linesFor(units) + linesFor(units - budget.ourStripLess);
    }
    const heightUnits =
        budget.rows.play * (1 + attachmentAllowance) +
        (ownPile === null ? budget.rows.pile * budget.pileRatio : 0) +
        budget.rows.hand * budget.handRatio;
    const pileHeight = ownPile === null ? 0 : pileLines * ownPile * cardHeight;
    const rowCount = budget.rows.play + pileLines + Math.ceil(budget.rows.hand);
    const freeHeight =
        height - (budget.chrome.height + playMarginRem) * rem - rowCount * gap - pileHeight;
    const heightFit = freeHeight / (heightUnits * cardHeight);
    const rowFit =
        widestRow > 0 ? (freeWidth - widestRow * gap) / (widestRow * cardWidth) : Infinity;

    // Where piles are drawn at the board's card size, a strip too wide for the board makes every card smaller;
    // elsewhere the piles shrink on their own and the play areas keep their size
    const stripLimit = budget.pilesAtCardSize ? stripPileFit : Infinity;
    const fitted =
        Math.min(budget.max, heightFit, stripLimit, Math.max(rowFit, budget.min)) *
        Math.min(cardsSize, 1);
    const scale = toStep(clamp(fitted, absoluteMin, budget.max));
    const pile =
        (ownPile !== null ? Math.min(ownPile, scale) : null) ??
        (budget.pilesAtCardSize ? scale : Math.min(scale * budget.pileRatio, stripPileFit));

    return {
        card: scale,
        pile: toStep(Math.max(pile, absoluteMin)),
        hand: toStep(Math.max(scale * budget.handRatio, absoluteMin))
    };
};

export const computeAdaptiveScales = (options) => {
    const first = fitScales(options);
    const budget = layoutBudgets[options.mode] || layoutBudgets.wide;
    if (!budget.pileMin || first.pile < budget.pileCap) {
        return first;
    }
    // Where the play areas are drawn large (a tablet held upright), the piles may grow with them, as far as their
    // strips still fit
    const grown = fitScales(options, Math.max(budget.pileCap, first.card * budget.pileRatio));
    return grown.card >= first.card * 0.9 ? grown : first;
};
