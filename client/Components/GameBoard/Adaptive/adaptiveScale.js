import { rowTypeOf } from '../leftBehind';
import { desktopInterfaceFit } from '../../../hud';

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

// How wide the widest row in play is, in card widths: a kneeling card lies on its side and takes more room
export const widestRowUnits = (players) => {
    let widest = 0;
    for (const player of players || []) {
        const rows = {};
        for (const card of player?.cardPiles?.cardsInPlay || []) {
            const row = rowTypeOf(card);
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

// Per mode: rows (card heights), strips (card widths at pile scale, before stripExtraUnits) and chrome (rem). Cards
// grow to fill the room up to max, and shrink for a wide row only to min before the row overlaps instead.
const layoutBudgets = {
    narrow: {
        pileRatio: 0.7,
        handRatio: 1.1,
        min: 0.85,
        max: 1.8,
        // Piles share one size, as large as lets our strip (three cards narrower than theirs) fit, within pileMin and
        // pileCap; a strip still too wide scrolls sideways
        pileMin: 0.7,
        pileCap: 0.8,
        ourStripLess: 3,
        rows: { play: 4, pile: 2, hand: 1 },
        stripUnits: 9.5,
        chrome: { width: 1, height: 9.75 }
    },
    // Strips and play areas are one row each, scrolling sideways, so they cost height but never width. The prompt and
    // stats take a side column about a third of the width.
    short: {
        pileRatio: 1,
        handRatio: 1,
        min: 0.7,
        max: 1.6,
        rows: { play: 2, pile: 2, hand: 0 },
        rowGaps: false,
        stripUnits: 0,
        chrome: { width: 15, height: 1.5 }
    },
    // On a desktop the cards fill most of the room rather than all of it, and stop growing at max
    wide: {
        pilesAtCardSize: true,
        pileRatio: 1,
        handRatio: 1,
        fill: 0.9,
        min: 0.8,
        max: 1.5,
        rows: { play: 4, pile: 2, hand: 0 },
        stripUnits: 0,
        chrome: { width: 2, height: 4 }
    }
};

const scaleStep = 0.05;
const absoluteMin = 0.3;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toStep = (value) => Math.round(Math.floor(value / scaleStep + 1e-9) * scaleStep * 100) / 100;

// Fitted, the play areas fill the screen's height; the chosen card size applies on top (larger scrolls)
const fitScales = (
    {
        mode,
        width,
        height,
        rem = 16,
        widestRow = 0,
        cardsSize = 1,
        stripExtra = 0,
        interfaceScale = 1
    },
    pileCap
) => {
    const budget = layoutBudgets[mode] || layoutBudgets.wide;
    const cardWidth = card.width * rem;
    const cardHeight = card.height * rem;
    const gap = gapRem * rem;

    // The prompt, the stats and their padding are drawn at the interface's size
    const chromeRem = rem * interfaceScale;
    const freeWidth = width - budget.chrome.width * chromeRem;
    // The largest pile scale at which a strip of piles fits across the board
    const stripPileFit =
        budget.stripUnits > 0
            ? (freeWidth - (budget.stripUnits + stripExtra) * gap) /
              ((budget.stripUnits + stripExtra) * cardWidth)
            : Infinity;

    // Piles with a size of their own take their strips' height first; the play areas fit the rest
    let ownPile = null;
    const pileLines = budget.rows.pile;
    if (!budget.pilesAtCardSize && budget.pileMin) {
        const units = budget.stripUnits + stripExtra;
        const fitFor = (stripUnits) => (freeWidth - stripUnits * gap) / (stripUnits * cardWidth);
        ownPile = clamp(
            fitFor(units - budget.ourStripLess),
            budget.pileMin,
            pileCap ?? budget.pileCap
        );
    }
    const heightUnits =
        budget.rows.play * (1 + attachmentAllowance) +
        (ownPile === null ? budget.rows.pile * budget.pileRatio : 0) +
        budget.rows.hand * budget.handRatio;
    const pileHeight = ownPile === null ? 0 : pileLines * ownPile * cardHeight;
    const rowCount =
        budget.rowGaps === false ? 0 : budget.rows.play + pileLines + Math.ceil(budget.rows.hand);
    const freeHeight =
        height -
        budget.chrome.height * chromeRem -
        playMarginRem * rem -
        rowCount * gap -
        pileHeight;
    const heightFit = freeHeight / (heightUnits * cardHeight);
    const rowFit =
        widestRow > 0 ? (freeWidth - widestRow * gap) / (widestRow * cardWidth) : Infinity;

    // Where piles are drawn at the board's card size, a strip too wide for the board makes every card smaller;
    // elsewhere the piles shrink on their own and the play areas keep their size
    const stripLimit = budget.pilesAtCardSize ? stripPileFit : Infinity;
    const fitted =
        Math.min(
            budget.max,
            heightFit * (budget.fill ?? 1),
            stripLimit,
            Math.max(rowFit, budget.min)
        ) * cardsSize;
    const scale = toStep(clamp(fitted, absoluteMin, budget.max * Math.max(1, cardsSize)));
    const pile =
        (ownPile !== null ? Math.min(ownPile * Math.max(1, cardsSize), scale) : null) ??
        (budget.pilesAtCardSize ? scale : Math.min(scale * budget.pileRatio, stripPileFit));

    return {
        card: scale,
        pile: toStep(Math.max(pile, absoluteMin)),
        hand: toStep(Math.max(scale * budget.handRatio, absoluteMin)),
        room: heightFit
    };
};

// The interface is drawn larger or smaller than normal as the screen is larger or smaller than a usual one for
// its layout: a phone held upright, a phone on its side, or a desktop
const interfaceReferences = {
    narrow: { width: 390, height: 844 },
    short: { width: 844, height: 390 },
    wide: { width: 1600, height: 950 }
};
const interfaceRanges = { phone: { min: 0.85, max: 1.4 }, wide: { min: 0.8, max: 1.15 } };

// A desktop's interface follows the classic board's (desktopInterfaceFit): a step below normal, growing slowly
export const adaptiveInterfaceScale = (mode, { width, height } = {}) => {
    const wide = !interfaceReferences[mode] || mode === 'wide';
    const reference = wide ? interfaceReferences.wide : interfaceReferences[mode];
    if (!width || !height) {
        return 1;
    }
    const fit = Math.min(width / reference.width, height / reference.height);
    const range = wide ? interfaceRanges.wide : interfaceRanges.phone;
    return clamp(toStep(wide ? desktopInterfaceFit(fit) : fit), range.min, range.max);
};

// How much of a larger card size than normal the board adds, by the length of its shorter side: all of it on a
// desktop, a quarter on a phone, where cards fitted to the screen already fill it
const growthSides = { phone: 400, desktop: 950 };
const phoneGrowth = 0.25;

export const effectiveCardsSize = (cardsSize = 1, { width, height } = {}) => {
    if (cardsSize <= 1 || !width || !height) {
        return cardsSize;
    }
    const along = clamp(
        (Math.min(width, height) - growthSides.phone) / (growthSides.desktop - growthSides.phone),
        0,
        1
    );
    const growth = phoneGrowth + (1 - phoneGrowth) * along;
    return 1 + (cardsSize - 1) * growth;
};

// The largest card scale whose rows fit the board's height without scrolling, with the prompt and stats drawn at
// interfaceScale
export const cardRoom = (options) => fitScales({ ...options, cardsSize: 1 }).room;

// auto: fit the cards to the board, then apply the chosen size; off, the chosen size is the size, as on the
// classic board
export const computeAdaptiveScales = (options) => {
    const budget = layoutBudgets[options.mode] || layoutBudgets.wide;
    if (options.auto === false) {
        const size = options.cardsSize ?? 1;
        const at = (ratio) => toStep(Math.max(size * ratio, absoluteMin));
        return {
            card: at(1),
            pile: at(budget.pilesAtCardSize ? 1 : budget.pileRatio),
            hand: at(budget.handRatio)
        };
    }
    options = { ...options, cardsSize: effectiveCardsSize(options.cardsSize, options) };
    const first = fitScales(options);
    if (!budget.pileMin || first.pile < budget.pileCap) {
        return first;
    }
    // Where the play areas are drawn large (a tablet held upright), the piles may grow with them, as far as their
    // strips still fit
    const grown = fitScales(options, Math.max(budget.pileCap, first.card * budget.pileRatio));
    return grown.card >= first.card * 0.9 ? grown : first;
};
