import { cardImageSrc } from './imageCache';
import { cardScaleOf } from './cardScale';
import { liftFrames, slapConfig, slapFrames, slapsInto } from './tableFeel';

export const flipConfig = {
    duration: 380,
    exitDuration: 200,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    shuffleGap: 600,
    sequenceDuration: 320,
    turnDuration: 440,
    sequenceStep: 380,
    maxSequence: 2000,
    maxAnimated: 30,
    minDistance: 1
};

const plotDeckPrefix = 'plots:';

// Where cards are measured from: the board's content, where the board scrolls as a whole (its flight layer, which
// covers it), or else the screen. Measured from the board, a scroll (by hand, or the board keeping to its end as it
// grows) moves no card, so only cards that really moved are animated. Measured once for each pass over the board.
let originNow = null;
const boardOrigin = () => {
    if (!originNow) {
        const layer = document.querySelector('[data-flight-layer]');
        const rect = layer?.getBoundingClientRect();
        originNow = rect ? { left: rect.left, top: rect.top } : { left: 0, top: 0 };
        queueMicrotask(() => {
            originNow = null;
        });
    }
    return originNow;
};

const fromScreen = (rect) => {
    const origin = boardOrigin();
    return { ...rect, left: rect.left - origin.left, top: rect.top - origin.top };
};

const rectOf = (el) => {
    const rect = el.getBoundingClientRect();
    return fromScreen({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
};

// Cards go into and come off the top of a pile, which stands above the pile's outline when it is deep
const topOfPile = (el) => {
    const rect = rectOf(el);
    const stack = el.querySelector('[data-pile-stack]');
    if (stack?.parentElement) {
        rect.top +=
            stack.getBoundingClientRect().top - stack.parentElement.getBoundingClientRect().top;
    }
    return rect;
};

// Everything that makes up a card on the table, so it can all be animated together
const surfaceOf = (el) =>
    el.querySelector('[data-flip-slot] > [data-card-surface]') ||
    el.querySelector(':scope > [data-card-surface]');
const slotOf = (el) => el.querySelector('[data-flip-slot]') || (surfaceOf(el) && el);
const overlaysOf = (el) => [
    ...(slotOf(el)?.querySelectorAll(':scope > [data-card-overlay]') ?? [])
];
// The body is the card itself: its face (the image, or what is drawn when that fails), its shadow and
// anything printed on it. It is what turns over, so nothing of the card is left lying flat.
const bodyOf = (el) => surfaceOf(el)?.querySelector(':scope > [data-card-body]');
const imageOf = (body) => body?.querySelector(':scope > [data-card-face] > img');

// Cards listed in an open popup are left to the board, which moves them to and from their pile or the card
// they lie under. The one exception is a card just dropped into a popup: it lands in the popup, where it was put.
let landInPopup = null;

export const setLandInPopup = (uuid) => {
    landInPopup = uuid;
};

const measureCards = (root = document) => {
    const cards = new Map();
    root.querySelectorAll('[data-flip]').forEach((el) => {
        const inPopup = !!el.closest('[data-popup]');
        const landsHere = landInPopup === el.dataset.flip;
        if (inPopup ? !landsHere : landsHere && cards.get(el.dataset.flip)?.inPopup) {
            return;
        }
        const rect = rectOf(el);
        const slotEl = el.querySelector('[data-flip-slot]') || el;
        const slot = rectOf(slotEl);
        cards.set(el.dataset.flip, {
            el,
            inPopup,
            ...rect,
            slot,
            slotEl,
            holdsCards: el.querySelector('[data-flip]') !== null,
            from: el.dataset.flipFrom,
            parent: el.parentElement?.closest('[data-flip]')?.dataset.flip,
            source: el.dataset.flipSource,
            face: imageOf(bodyOf(el))?.getAttribute('src'),
            faceNode: bodyOf(el)?.cloneNode(true),
            under: el.dataset.flipUnder !== undefined,
            underOf: el.dataset.flipUnder || undefined,
            rot: Number(el.dataset.flipRot) || 0,
            scale: cardScaleOf(el),
            z: el.dataset.flipZ === undefined ? undefined : Number(el.dataset.flipZ)
        });
    });
    return cards;
};

const measureDecks = (root = document) => {
    const decks = new Map();
    root.querySelectorAll('[data-flip-deck]').forEach((el) => {
        decks.set(el.dataset.flipDeck, topOfPile(el));
    });
    return decks;
};

const centre = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

// What a card shows in flight: each end is described by its place, angle and face, and the card turns over when the
// faces differ and rotates when the angles do. Kneeling, standing and going facedown into a deck all follow.
export const changeBetween = (from, to, back = cardImageSrc('cardback')) => {
    const turnsOver = !!from.face && !!to.face && from.face !== to.face;
    // A facedown plot is drawn as an upright card back laid on its side, and a plot is drawn as it is.
    // Both lie sideways on the table, so going from one to the other is not a turn.
    const bothSideways = isWide(from.slot) && isWide(to.slot);
    return {
        travel: from.source !== to.source,
        rotate: bothSideways ? 0 : (from.rot || 0) - (to.rot || 0),
        ...(turnsOver && {
            turnFrom: from.face,
            turnNode: from.faceNode,
            turnTo: to.face,
            reveal: to.face !== back
        })
    };
};

const isWide = (rect) => !!rect && rect.width > rect.height;

const turnOf = ({ turnFrom, turnNode, turnTo, reveal }) =>
    turnFrom ? { turnFrom, turnNode, turnTo, reveal } : {};

// A card that changes angle turns about its middle, so the two middles are what line up
const aboutCentre = (fromSlot, to) => {
    const from = centre(fromSlot);
    const middle = centre(to.slot);
    return {
        dx: from.x - middle.x,
        dy: from.y - middle.y,
        origin: { x: middle.x - to.left, y: middle.y - to.top }
    };
};

// A card carried back to its place leaves the attachments and duplicates on it where they are
const alone = (was, now) =>
    was.solo && now.holdsCards
        ? { ...now, el: now.slotEl, left: now.slot.left, top: now.slot.top }
        : now;

const planMove = (uuid, was, arrived, change, config) => {
    const now = alone(was, arrived);
    // A card that stays in the same element kneels and stands by itself, so only a card that has changed
    // element is turned to its new angle here
    const turned = was.el !== now.el && change.rotate !== 0;
    const places = {
        old: { left: was.left, top: was.top },
        now: { left: now.left, top: now.top },
        fromSource: was.source,
        liftedFrom: was.source,
        toSource: now.source,
        nested: now.source === 'attached',
        z: now.z
    };
    if (turned) {
        return {
            type: 'move',
            uuid,
            el: now.el,
            ...aboutCentre(was.slot, now),
            rotate: change.rotate,
            travel: change.travel,
            ...places
        };
    }

    const dx = was.left - now.left;
    const dy = was.top - now.top;
    if (Math.abs(dx) < config.minDistance && Math.abs(dy) < config.minDistance) {
        return null;
    }

    return { type: 'move', uuid, el: now.el, dx, dy, rotate: 0, travel: change.travel, ...places };
};

// A hand card that has vanished most likely went back to its owner's draw deck
const returnedToDeck = (was, decks) => {
    const deck = was.source === 'hand' && was.from && decks.get(was.from);
    return deck ? { ...deck, source: 'draw deck' } : null;
};

// Whether the card itself is wider than tall (a plot), whatever angle it is lying at
const liesSideways = (rect, rot) => {
    const upright = ((rot || 0) / 90) % 2 === 0;
    return upright ? rect.width > rect.height : rect.height > rect.width;
};

// How a card rests in a pile it is not drawn in: facedown in a hidden pile, and turned to the way the
// pile lies. A pile that does not say how it lies leaves the card at the angle it had.
const restingIn = (pile, was, back) => {
    const hidden = pile.hidden ?? pile.source === 'draw deck';
    const knowsAngle = pile.sideways !== undefined && pile.width !== undefined && !!was.slot;
    return {
        source: pile.source,
        rot: knowsAngle
            ? pile.sideways === liesSideways(was.slot, was.rot)
                ? 0
                : 90
            : was.rot || 0,
        face: hidden ? back : (pile.face ?? was.face)
    };
};

// A card drawn or revealed starts as it lies in its deck: upright and facedown
const lyingIn = (deck, now, back) => ({
    source: null,
    rot: deck.width === undefined ? now.rot || 0 : 0,
    face: back
});

export const planFlip = ({
    before,
    after,
    decks = new Map(),
    findPile = () => null,
    config = flipConfig
}) => {
    if (!before || before.size === 0) {
        return [];
    }

    const back = cardImageSrc('cardback');
    const plan = [];
    for (const [uuid, now] of after) {
        const was = before.get(uuid);
        if (was) {
            const change = changeBetween(was, now, back);
            const move = planMove(uuid, was, now, change, config);
            // A card put under a card that was already on top of the pile stays under it all the way, as does a
            // card placed underneath a card on the board
            const under =
                (!!now.underOf && before.get(now.underOf)?.source === now.source) ||
                (now.source === 'underneath' && !now.inPopup);
            if (move) {
                plan.push({ ...move, ...turnOf(change), ...(under && { under }) });
            } else if (change.turnFrom && now.el) {
                plan.push({ type: 'turn', uuid, el: now.el, ...turnOf(change) });
            }
            continue;
        }

        const origin = now.from && decks.get(now.from);
        // A card newly shown under a pile's top card only came from the deck if the top card did too: otherwise it
        // was already in the pile, and is uncovered by the top card leaving
        const uncovered = now.under && (!now.underOf || before.has(now.underOf));
        if ((!origin && (now.under || findPile(uuid))) || (origin && uncovered)) {
            continue;
        }
        if (!origin) {
            plan.push({ type: 'fade', uuid, el: now.el, travel: true, toSource: now.source });
            continue;
        }

        const change = changeBetween(lyingIn(origin, now, back), now, back);
        plan.push({
            type: 'move',
            uuid,
            el: now.el,
            dx: origin.left - now.left,
            dy: origin.top - now.top,
            ...(change.rotate !== 0 && aboutCentre(origin, now)),
            rotate: change.rotate,
            travel: change.travel,
            sequential: !now.from.startsWith(plotDeckPrefix),
            ...turnOf(change),
            old: { left: origin.left, top: origin.top },
            now: { left: now.left, top: now.top },
            toSource: now.source
        });
    }

    for (const [uuid, was] of before) {
        // A card that was being carried has no element left, but can still be shown from its face
        const gone = was.el ? !was.el.isConnected : !!was.faceNode;
        if (after.has(uuid) || !gone) {
            continue;
        }

        const found = findPile(uuid);
        if (found && found.source === was.source) {
            continue;
        }
        const pile = found || returnedToDeck(was, decks);
        if (!pile) {
            if (was.el) {
                plan.push({ type: 'exit', el: was.el, rect: was });
            }
            continue;
        }

        const change = changeBetween(was, restingIn(pile, was, back), back);
        const turned = change.rotate !== 0;
        const middle = turned && centre(was.slot);
        const target = turned && centre(pile);
        plan.push({
            type: 'ghost',
            el: was.el,
            ...(!was.el && { built: { uuid, faceNode: was.faceNode, rot: was.rot || 0 } }),
            rect: was,
            dx: turned ? target.x - middle.x : pile.left - was.left,
            dy: turned ? target.y - middle.y : pile.top - was.top,
            ...(turned && {
                rotate: change.rotate,
                origin: { x: middle.x - was.left, y: middle.y - was.top }
            }),
            ...(change.turnTo && { turnTo: change.turnTo }),
            travel: true,
            behind: !!was.under || !!pile.covered || isCovered(was.source),
            area: pile.area,
            pileEl: pile.pileEl,
            old: { left: was.left, top: was.top },
            now: { left: pile.left, top: pile.top },
            fromSource: was.source,
            liftedFrom: was.el ? was.source : 'carried',
            toSource: pile.source,
            depth: pile.depth,
            returning: pile.source === 'draw deck'
        });
    }

    return relativeToParents(plan, after, config);
};

// Cards attached to or under another card ride along with it, so only their own extra movement is animated
const relativeToParents = (plan, after, config) => {
    const leads = new Map(plan.filter((item) => item.uuid).map((item) => [item.uuid, item]));
    return plan.filter((item) => {
        const lead = leads.get(item.uuid && after.get(item.uuid)?.parent);
        if (!lead) {
            return true;
        }
        if (item.type !== 'move' || lead.type !== 'move' || lead.rotate) {
            return false;
        }

        item.dx -= lead.dx;
        item.dy -= lead.dy;
        return Math.abs(item.dx) >= config.minDistance || Math.abs(item.dy) >= config.minDistance;
    });
};

// Cards moving together go one after another, with the last one landing no later than maxSequence
export const sequenceStep = (count, config = flipConfig) =>
    count > 1
        ? Math.min(config.sequenceStep, (config.maxSequence - config.duration) / (count - 1))
        : 0;

export const sequenceDelays = (count, config = flipConfig) => {
    const step = sequenceStep(count, config);
    return Array.from({ length: count }, (_, index) => index * step);
};

const sameRow = 20;
const byOldPlace = (a, b) => {
    if (!a.old || !b.old) {
        return 0;
    }

    const rows = a.old.top - b.old.top;
    return Math.abs(rows) > sameRow ? rows : a.old.left - b.old.left;
};

// Cards going to the same pile move deepest first, so the card that ends on top lands last
const stackTopLast = (items) => {
    const sources = new Set(
        items.filter((item) => item.type === 'ghost').map((item) => item.toSource)
    );
    for (const source of sources) {
        const places = items.flatMap((item, index) => (item.toSource === source ? [index] : []));
        const ordered = places
            .map((index) => items[index])
            .sort((a, b) => {
                if ((a.type === 'ghost') !== (b.type === 'ghost')) {
                    return a.type === 'ghost' ? -1 : 1;
                }
                return (b.depth ?? 0) - (a.depth ?? 0);
            });
        places.forEach((index, position) => {
            items[index] = ordered[position];
        });
    }
};

const dot = (a, b) => a.x * b.x + a.y * b.y;
const offset = (from, to) => ({ x: to.left - from.left, y: to.top - from.top });

// A card that stays in its area shifts when a card leaves it or arrives in it
const causesShift = (traveller, shifter) => {
    const shift = offset(shifter.old, shifter.now);
    if (
        shifter.toSource != null &&
        traveller.fromSource === shifter.toSource &&
        dot(shift, offset(shifter.old, traveller.old)) > 0
    ) {
        return true;
    }

    return (
        shifter.toSource != null &&
        traveller.toSource === shifter.toSource &&
        dot(shift, offset(traveller.now, shifter.now)) > 0
    );
};

// Cards put back into the deck together leave a pause for the shuffle before anything is drawn
export const holdAfterReturns = (plan, config = flipConfig) =>
    plan.filter((item) => item.returning).length > 1 ? config.duration + config.shuffleGap : 0;

export const scheduleFlip = (plan, config = flipConfig) => {
    const hold = holdAfterReturns(plan, config);
    const travellers = plan
        .filter((item) => item.type !== 'exit' && item.travel && !item.returning)
        .sort(byOldPlace);
    stackTopLast(travellers);
    const sequence = travellers.length > 1;
    const delays = sequenceDelays(travellers.length, config);
    const duration = sequence ? config.sequenceDuration : config.duration;

    const scheduled = plan.map((item) => {
        if (item.type === 'exit') {
            return { ...item, delay: 0, duration: config.exitDuration };
        }
        if (item.returning) {
            return { ...item, delay: 0, duration: config.duration };
        }
        if (item.travel) {
            const wait = item.sequential ? hold : 0;
            return { ...item, delay: delays[travellers.indexOf(item)] + wait, duration };
        }
        return { ...item, delay: 0, duration: config.duration };
    });

    if (!sequence) {
        return scheduled;
    }

    const timed = scheduled.filter((item) => item.type !== 'exit' && item.travel);
    return scheduled.map((item) => {
        if (item.type !== 'move' || item.travel) {
            return item;
        }

        const causes = timed.filter((traveller) => causesShift(traveller, item));
        if (causes.length === 0) {
            return item;
        }

        const start = Math.min(...causes.map((traveller) => traveller.delay));
        const end = Math.max(...causes.map((traveller) => traveller.delay + traveller.duration));
        return { ...item, delay: start, duration: end - start };
    });
};

let pending = null;
let ignored = null;
let dropOrigin = null;
const piles = new Map();

export const setFlipIgnored = (uuid) => {
    ignored = uuid;
};

// The place a card was let go, as measured on the screen
export const setDropOrigin = (origin) => {
    dropOrigin = origin?.rect ? { ...origin, rect: fromScreen(origin.rect) } : origin;
};

export const registerPile = (id, entry) => {
    piles.set(id, entry);
    return () => piles.delete(id);
};

// A pile with a card fixed on top of it (the revealed plot) keeps that card above anything that moves
// in or out of the pile
const isCovered = (source) =>
    [...piles.values()].some(
        (entry) => entry.source === source && entry.covered && entry.el.isConnected
    );

const findPile = (uuid) => {
    for (const entry of piles.values()) {
        if (entry.uuids.has(uuid) && entry.el.isConnected) {
            const code = entry.codes?.get(uuid);
            return {
                ...topOfPile(entry.el),
                pileEl: entry.el,
                source: entry.source,
                depth: entry.uuids.get(uuid),
                covered: !!entry.covered,
                area: entry.el.closest('[data-flip-layers]'),
                hidden: !!entry.hidden || !code,
                sideways: entry.sideways,
                face: code ? cardImageSrc(code) : undefined
            };
        }
    }
    return null;
};

let holdUntil = 0;

// The board settling when it first appears should not animate
export const holdFlip = (milliseconds) => {
    holdUntil = Math.max(holdUntil, performance.now() + milliseconds);
};

export const motionOff = () =>
    document.hidden ||
    performance.now() < holdUntil ||
    document.documentElement.dataset.motion === 'off';

let drawHoldUntil = 0;

// How long until drawing may start after cards were put back into the deck
export const drawHoldRemaining = () => Math.max(0, drawHoldUntil - performance.now());

export const wasOnBoard = (uuid) => !!pending && pending.has(uuid);

export const captureCards = () => {
    const cards = motionOff() ? null : measureCards();
    if (dropOrigin) {
        if (cards) {
            const { uuid, rect, source, rot, faceNode, under } = dropOrigin;
            const body = faceNode && bodyAround(faceNode);
            cards.set(uuid, {
                el: null,
                ...rect,
                slot: rect,
                source,
                rot,
                solo: true,
                under,
                faceNode: body,
                face: imageOf(body)?.getAttribute('src')
            });
        }
        dropOrigin = null;
        ignored = null;
    }
    pending = cards;
};

// A card made up here, not by the board, is given the same body the board gives its cards
const bodyAround = (face) => {
    const body = document.createElement('div');
    body.dataset.cardBody = '';
    body.className = 'card-body';
    body.append(face);
    return body;
};

// Cards in flight go in one of two layers: above the board, or below the cards on it (for a card passing under a
// pile's top card, inside data-flip-layers so z-index orders it against the piles). The adaptive board's scrolling
// content has its own upper layer (data-flight-layer), so flights scroll with the board.
const hosts = {};
const areaHosts = new WeakMap();
const getHost = (behind, area) => {
    if (behind && area?.isConnected) {
        let inner = areaHosts.get(area);
        if (!inner?.isConnected) {
            inner = document.createElement('div');
            inner.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:199';
            area.appendChild(inner);
            areaHosts.set(area, inner);
        }
        return inner;
    }
    const board = !behind && document.querySelector('[data-flight-layer]');
    if (board) {
        return board;
    }

    const name = behind ? 'behind' : 'above';
    if (!hosts[name]?.isConnected) {
        hosts[name] = document.createElement('div');
        hosts[name].style.cssText =
            `position:fixed;inset:0;pointer-events:none;z-index:${behind ? 199 : 205}`;
        document.body.appendChild(hosts[name]);
    }
    return hosts[name];
};

// A card taken off the board to fly keeps the size it had there (rect.scale), not the size of the page around it.
// It is placed in its layer where it was (measured from the board, as every card is).
const detach = (el, rect, behind = false, area = null) => {
    const host = getHost(behind, area);
    const origin = host.getBoundingClientRect();
    const board = boardOrigin();
    el.style.cssText += `;position:absolute;left:${rect.left + board.left - origin.left}px;top:${rect.top + board.top - origin.top}px;width:${rect.width}px;height:${rect.height}px;margin:0;transform:none`;
    if (rect.scale) {
        el.style.setProperty('--card-scale', String(rect.scale));
    }
    host.appendChild(el);
};

// Whatever an animation put on the page goes once the animation is over, finished or cancelled: a later update
// cancels flights still going, and anything left behind would stay over the board for good
const whenOver = (animation, done) => animation.finished.then(done, done);

// Only animations that end: a card also runs its own endless ones (a loading spinner, a pulsing ring)
const endingAnimations = (el) =>
    el
        .getAnimations({ subtree: true })
        .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));

// Everything on the card moves together: the card with its shadow, and the counters and badges on it
const originOf = (slot, part) =>
    `${slot.clientWidth / 2 - part.offsetLeft}px ${slot.clientHeight / 2 - part.offsetTop}px`;

const animateCard = (el, frames, options) => {
    const surface = surfaceOf(el);
    if (!surface) {
        return;
    }

    surface.animate(frames.card, options);

    const slot = slotOf(el);
    for (const part of overlaysOf(el)) {
        const transformOrigin = originOf(slot, part);
        part.animate(
            frames.card.map((frame) => ({
                ...frame,
                ...(frames.rest !== undefined &&
                    frame.rotate === frames.rest && { rotate: '0deg' }),
                transformOrigin
            })),
            options
        );
    }

    if (frames.lift) {
        bodyOf(el)?.animate(frames.lift, { ...options, pseudoElement: '::after' });
    }
};

// A card is turned over across its shorter side, the way it is done by hand: an upright card turns
// sideways, and a card that is wider than tall (a plot) turns top over bottom
export const turnAxis = ({ width, height }) => (width > height ? 'X' : 'Y');

// A card turns over like a real one: the old face turns edge-on, then the new face turns up
const spin = (outgoing, incoming, { delay, duration }) => {
    const half = duration / 2;
    const shape = incoming.clientWidth ? incoming : outgoing;
    const axis = turnAxis({ width: shape.clientWidth, height: shape.clientHeight });
    const turned = (angle) => ({ transform: `perspective(700px) rotate${axis}(${angle}deg)` });
    const away = outgoing.animate([turned(0), turned(90)], {
        duration: half,
        delay,
        easing: 'ease-in',
        fill: 'both'
    });
    incoming.animate([turned(-90), turned(0)], {
        duration: half,
        delay: delay + half,
        easing: 'ease-out',
        fill: 'both'
    });
    return away;
};

// Counters and badges are not part of the face, so they drop out while the card is edge-on
const fadeOverlays = (el, { delay, duration }) =>
    overlaysOf(el).forEach((part) =>
        part.animate(
            [
                { opacity: 1 },
                { opacity: 0, offset: 0.4 },
                { opacity: 0, offset: 0.6 },
                { opacity: 1 }
            ],
            { id: 'flip', duration, delay, easing: 'linear' }
        )
    );

// A copy of a card showing this face as the board shows it right now, so it includes what is drawn when
// its image fails
const shownBody = (src) =>
    [...document.querySelectorAll('[data-card-body]')]
        .find((body) => imageOf(body)?.getAttribute('src') === src)
        ?.cloneNode(true);

// A card face made from nothing but its image, with the same body around it as the board gives a card
const builtBody = (src, like) => {
    const body = like.cloneNode(false);
    const face = document.createElement('div');
    face.dataset.cardFace = '';
    face.className = 'absolute inset-0 overflow-hidden rounded-[inherit]';
    const image = document.createElement('img');
    image.setAttribute('src', src);
    image.alt = '';
    image.draggable = false;
    image.className = 'absolute left-0 top-0 h-full w-full pointer-events-none select-none';
    face.append(image);
    body.append(face);
    return body;
};

// Whether an image is drawn upright (a card back, a character) or on its side (a plot), when that is known
const isPortrait = (src) => {
    if (src === cardImageSrc('cardback')) {
        return true;
    }

    const probe = new Image();
    probe.src = src;
    return probe.complete && probe.naturalWidth > 0
        ? probe.naturalHeight > probe.naturalWidth
        : undefined;
};

// The card as it looks at the other end of its move, made to fit the card it is put on: a face that is
// drawn the other way round from the card it replaces is laid on its side, so it is never stretched
const bodyFor = (src, like) => {
    const body = shownBody(src) || builtBody(src, like);
    const width = like.clientWidth;
    const height = like.clientHeight;
    const portrait = isPortrait(src);
    if (!body || !width || !height || portrait === undefined || portrait === height > width) {
        return body;
    }

    const turned = document.createElement('div');
    turned.style.cssText = `position:absolute;border-radius:inherit;width:${height}px;height:${width}px;left:${(width - height) / 2}px;top:${(height - width) / 2}px;transform:rotate(90deg)`;
    turned.append(...body.children);
    const holder = like.cloneNode(false);
    holder.append(turned);
    return holder;
};

// A card back shaped like the given card body
export const cardBackLike = (like) => bodyFor(cardImageSrc('cardback'), like);

// How long until the cards in an element have finished turning over and moving
export const flipRemaining = (el) =>
    Math.max(
        0,
        ...el
            .getAnimations({ subtree: true })
            .filter((animation) => animation.id === 'flip')
            .map(
                (animation) =>
                    animation.effect.getComputedTiming().endTime - (animation.currentTime ?? 0)
            )
    );

// A card that is leaving turns to the face it will show where it is going
const turnAway = (el, { to, delay, duration }) => {
    const outgoing = bodyOf(el);
    const incoming = outgoing && bodyFor(to, outgoing);
    if (!incoming) {
        return;
    }

    outgoing.after(incoming);
    spin(outgoing, incoming, { delay, duration });
    fadeOverlays(el, { delay, duration });
};

// The card already shows its new face, so the old one is put back on top just to be turned away
const turnFace = (el, { from, node, delay, duration }) => {
    const incoming = bodyOf(el);
    if (!incoming) {
        return;
    }

    // A card back is always made to fit the card it is on: the copy kept from before may be an upright
    // back, which does not fit a plot
    const isBack = from === cardImageSrc('cardback');
    const outgoing = (!isBack && node) || (from && bodyFor(from, incoming)) || node;
    if (!outgoing) {
        return;
    }

    incoming.before(outgoing);
    whenOver(spin(outgoing, incoming, { delay, duration }), () => outgoing.remove());
    fadeOverlays(el, { delay, duration });
};

const revealGlow = [
    { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
    {
        boxShadow:
            '0 0 calc(16px * var(--card-scale, 1)) calc(5px * var(--card-scale, 1)) rgba(255, 255, 255, 0.75)',
        offset: 0.5
    },
    { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }
];
const rise = [{ scale: 1 }, { scale: 1.08, offset: 0.5 }, { scale: 1 }];
const highlightFade = 220;
const glowLength = 520;

// A highlight is drawn flat around the card, which gives the game away while the card is in the air or
// turning over. It stays off until the card has landed, then fades in. A reveal flashes first.
const landHighlight = (el, { delay, duration, reveal = false }) => {
    const surface = surfaceOf(el);
    if (!surface) {
        return;
    }

    const hidden = duration + (reveal ? glowLength : 0);
    const total = hidden + highlightFade;
    surface.animate(
        [
            { boxShadow: 'none', offset: 0 },
            { boxShadow: 'none', offset: hidden / total },
            { offset: 1 }
        ],
        { id: 'flip', duration: total, delay, easing: 'linear', fill: 'backwards' }
    );
    if (reveal) {
        surface.animate(revealGlow, { id: 'flip', duration: glowLength, delay: delay + duration });
    }
};

// The card rises while it turns, and a reveal flashes
const turnInPlace = ({ el, turnFrom, turnNode, delay, reveal }) => {
    const duration = flipConfig.turnDuration;
    turnFace(el, { from: turnFrom, node: turnNode, delay, duration });
    animateCard(el, { card: rise }, { id: 'flip', duration, delay, easing: 'ease-in-out' });
    landHighlight(el, { delay, duration, reveal });
};

// A card knelt or stood rises a little as it turns
export const pulseCard = (slot) => {
    if (!slot || motionOff()) {
        return;
    }

    animateCard(slot, { card: rise }, { id: 'kneel', duration: 380, easing: 'ease-in-out' });
};

// The card is lifted off the table while it travels, then lands with a small settle
const liftCard = (el, { delay, duration, toSource, liftedFrom }) => {
    const frames = liftFrames({ uuid: el.dataset.flip, toSource, fromSource: liftedFrom });
    animateCard(el, frames, {
        id: 'flip',
        duration,
        delay,
        easing: 'linear',
        fill: 'backwards'
    });
};

const slapTotal = slapConfig.move + slapConfig.settle;
const slapShare = slapConfig.move / slapTotal;

// The card lands on the table: a bounce and a settle on top of the move
const bounceCard = (el, { delay, toSource, liftedFrom }) => {
    const frames = slapFrames({ uuid: el.dataset.flip, toSource, fromSource: liftedFrom });
    animateCard(el, frames, {
        id: 'flip',
        duration: frames.total,
        delay,
        easing: 'linear',
        fill: 'backwards'
    });
};

// A fast move that stops suddenly, then holds still while the card bounces
const slapKeyframes = (item) => {
    const frames = keyframesFor(item);
    const end = frames[frames.length - 1];
    const lead = frames.slice(0, -1).map((frame) => ({ ...frame }));
    lead[0].offset = 0;
    lead[lead.length - 1].easing = slapConfig.easing;

    return [...lead, { ...end, offset: slapShare }, { ...end, offset: 1 }];
};

// A carried card has no element left on the board, so one is built from its face. A card back lying sideways keeps
// its face rotated inside, so the face can be swapped for a sideways one without stretching.
const buildGhost = ({ uuid, faceNode, rot }, rect) => {
    const surface = document.createElement('div');
    surface.dataset.cardSurface = '';
    surface.style.cssText = `position:absolute;left:0;top:0;width:${rect.width}px;height:${rect.height}px;border-radius:calc(var(--card-scale, 1) * 0.25rem)`;
    if ((rot / 90) % 2 !== 0) {
        const turned = document.createElement('div');
        turned.style.cssText = `position:absolute;border-radius:inherit;width:${rect.height}px;height:${rect.width}px;left:${(rect.width - rect.height) / 2}px;top:${(rect.height - rect.width) / 2}px;transform:rotate(${rot}deg)`;
        turned.append(...faceNode.children);
        faceNode.append(turned);
    }
    surface.append(faceNode);

    const el = document.createElement('div');
    el.dataset.flip = uuid;
    el.append(surface);
    return el;
};

// A pile's label stays hidden while cards fly into it, and fades in once the last has settled on top
const labelFade = 450;
const labelHolds = new WeakMap();
const labelOf = (el) =>
    el?.closest?.('[data-labelled-area]')?.querySelector(':scope > [data-area-label]') ?? null;

const holdLabel = (label) => {
    if (!label) {
        return () => {};
    }
    const holds = (labelHolds.get(label) ?? 0) + 1;
    labelHolds.set(label, holds);
    if (holds === 1) {
        label.getAnimations().forEach((animation) => animation.cancel());
        label.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 60000, fill: 'both' });
    }
    let released = false;
    return () => {
        if (released) {
            return;
        }
        released = true;
        const left = (labelHolds.get(label) ?? 1) - 1;
        labelHolds.set(label, left);
        if (left > 0) {
            return;
        }
        label.getAnimations().forEach((animation) => animation.cancel());
        label.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: labelFade,
            easing: 'ease-out'
        });
    };
};

const animateGhost = (item) => {
    const showLabel = holdLabel(labelOf(item.pileEl));
    const { rect, dx, dy, rotate, origin, turnTo, delay, duration, returning, toSource } = item;
    const el = item.el ?? buildGhost(item.built, rect);
    detach(el, rect, item.behind, item.area);
    // The card is in the air until it is gone, so it never shows a highlight
    surfaceOf(el)?.style.setProperty('box-shadow', 'none');
    if (origin) {
        el.style.transformOrigin = `${origin.x}px ${origin.y}px`;
    }

    const slap = !returning && slapsInto(toSource);
    if (slap) {
        bounceCard(el, { delay, toSource, liftedFrom: item.liftedFrom });
    } else {
        liftCard(el, { delay, duration, toSource, liftedFrom: item.liftedFrom });
    }
    if (turnTo) {
        turnAway(el, { to: turnTo, delay, duration: slap ? slapConfig.move : duration });
    }

    // The card ends at the angle it rests at in the pile, so a kneeling card stands as it goes
    const turn = (angle) => (rotate ? ` rotate(${angle}deg)` : '');
    const start = { transform: `translate(0, 0)${turn(0)}` };
    const end = { transform: `translate(${dx}px, ${dy}px)${turn(-rotate)}` };
    const animation = slap
        ? el.animate(
              [
                  { ...start, offset: 0, easing: slapConfig.easing },
                  { ...end, offset: slapShare },
                  { ...end, offset: 1 }
              ],
              { duration: slapTotal, delay, easing: 'linear', fill: 'both' }
          )
        : el.animate([start, end], {
              duration,
              delay,
              easing: flipConfig.easing,
              fill: 'both'
          });
    whenOver(animation, () => {
        el.remove();
        showLabel();
    });
};

const animateExit = ({ el, rect, duration }) => {
    detach(el, rect);
    const animation = el.animate(
        [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.9)' }
        ],
        { duration, easing: 'ease-in', fill: 'forwards' }
    );
    whenOver(animation, () => el.remove());
};

export const keyframesFor = (item) => {
    if (item.type === 'fade') {
        return [
            { opacity: 0, transform: 'scale(0.9)' },
            { opacity: 1, transform: 'scale(1)' }
        ];
    }

    const origin = item.origin ? { transformOrigin: `${item.origin.x}px ${item.origin.y}px` } : {};
    // Attachments slide in at the level they come to rest, behind their card and the attachments already on it
    // A card that lands under the top card of its pile stays under it all the way
    const level = item.nested ? String(item.z ?? 199) : item.travel ? '205' : '200';
    const lifted = { zIndex: item.under ? 'auto' : level };
    const start = {
        ...origin,
        transform: `translate(${item.dx}px, ${item.dy}px) rotate(${item.rotate}deg)`,
        ...lifted
    };
    const end = { ...origin, transform: 'translate(0, 0) rotate(0deg)', ...lifted };

    // A drawn card stays hidden until its turn, so the deck keeps showing its own top card
    return item.sequential
        ? [{ ...start, opacity: 0, offset: 0 }, { ...start, opacity: 1, offset: 0.001 }, end]
        : [start, end];
};

const restingLevel = 200;
const landingPoint = 0.7;

// A card in flight is lifted above the board, then drops to the level it rests at as it nears its place,
// so it passes behind the cards that are above that place (the cards to its right in a hand)
export const landingFrames = (item, point = landingPoint) =>
    item.type === 'move' && item.travel && !item.nested && !item.under
        ? [
              { zIndex: '205', offset: 0 },
              { zIndex: '205', offset: point, easing: 'steps(1, jump-start)' },
              { zIndex: String(restingLevel), offset: 1 }
          ]
        : null;

// Cards still in flight are left to finish, so a later update never cuts a flight short.
// A card landing inside a clipping area (data-clips) would be cut off on its way in, so a copy flies above it instead
// and the card shows once it lands. The copy loses its flip markers, so it is never measured as a card.
const flyAbove = (el) => {
    if (!el.closest('[data-clips]')) {
        return { target: el, settle: () => {} };
    }
    const copy = el.cloneNode(true);
    for (const node of [copy, ...copy.querySelectorAll('*')]) {
        node.removeAttribute('data-flip');
        node.removeAttribute('data-flip-deck');
    }
    copy.dataset.flipCopy = el.dataset.flip;
    detach(copy, { ...rectOf(el), scale: cardScaleOf(el) });
    el.style.visibility = 'hidden';
    return {
        target: copy,
        settle: () => {
            const running = () =>
                endingAnimations(copy).filter((animation) => animation.playState !== 'finished');
            const done = () =>
                running().length > 0
                    ? Promise.allSettled(running().map((a) => a.finished)).then(done)
                    : Promise.resolve();
            return done().then(() => {
                copy.remove();
                el.style.visibility = '';
            });
        }
    };
};

// Once every animation the card was given has ended
const settledFlight = (el) =>
    Promise.allSettled(endingAnimations(el).map((animation) => animation.finished));

// Cards in the air: when each is done with (a card flying as a copy, once the copy is gone), when it lands, the copy
// flying above for it (if any), and where it is headed
const flights = new Map();
const staleAfter = 3000;

const inFlight = () => {
    const now = performance.now();
    for (const [uuid, flight] of flights) {
        // A copy gone some other way, or long overdue, no longer holds its card
        const stale = flight.copy && (!flight.copy.isConnected || now > flight.land + staleAfter);
        if (flight.end <= now || stale) {
            flights.delete(uuid);
        }
    }
    return new Set(flights.keys());
};

// A card in the air whose place moves before it lands (a hand closing up as the next card is drawn) is steered to its
// new place for the rest of its flight, rather than landing where its place was and jumping
// A copy already landed (still showing its landing glow) slides over in this long
const steerTime = 200;

const steerFlights = (flying, after) => {
    const now = performance.now();
    for (const uuid of flying) {
        const flight = flights.get(uuid);
        const place = after.get(uuid);
        if (!flight?.copy?.isConnected || !flight.to || !place) {
            continue;
        }
        const dx = place.left - flight.to.left;
        const dy = place.top - flight.to.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            continue;
        }
        const from = flight.shift;
        const to = { x: from.x + dx, y: from.y + dy };
        flight.copy.animate(
            [{ translate: `${from.x}px ${from.y}px` }, { translate: `${to.x}px ${to.y}px` }],
            {
                duration: Math.max(steerTime, flight.land - now),
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
        flight.shift = to;
        flight.to = { left: place.left, top: place.top };
    }
};

export const playPendingFlip = (root = document) => {
    const before = pending;
    pending = null;
    if (!before || motionOff()) {
        return;
    }

    const flying = inFlight();
    root.querySelectorAll('[data-flip]').forEach((el) => {
        if (flying.has(el.dataset.flip)) {
            return;
        }
        el.getAnimations({ subtree: true })
            .filter((animation) => animation.id === 'flip')
            .forEach((animation) => animation.cancel());
    });

    const after = measureCards(root);
    if (landInPopup && after.has(landInPopup)) {
        landInPopup = null;
    }
    steerFlights(flying, after);
    for (const uuid of [ignored, ...flying]) {
        before.delete(uuid);
        after.delete(uuid);
    }

    const plan = planFlip({ before, after, decks: measureDecks(root), findPile });
    if (plan.length === 0 || plan.length > flipConfig.maxAnimated) {
        return;
    }

    drawHoldUntil = Math.max(drawHoldUntil, performance.now() + holdAfterReturns(plan));
    for (const item of scheduleFlip(plan)) {
        if (item.type === 'exit') {
            animateExit(item);
            continue;
        }
        if (item.type === 'ghost') {
            animateGhost(item);
            continue;
        }
        if (item.type === 'turn') {
            turnInPlace(item);
            continue;
        }

        const slap =
            item.type === 'move' && item.travel && !item.nested && slapsInto(item.toSource);
        const duration = slap ? slapTotal : item.duration;
        const easing = slap ? 'linear' : flipConfig.easing;
        const flies = item.type === 'move' && item.travel && !item.nested;
        const { target, settle } = flies
            ? flyAbove(item.el)
            : { target: item.el, settle: () => null };
        const showLabel = flies ? holdLabel(labelOf(item.el)) : () => {};
        target.animate(slap ? slapKeyframes(item) : keyframesFor(item), {
            id: 'flip',
            duration,
            easing,
            delay: item.delay,
            fill: 'backwards'
        });

        if (item.turnFrom) {
            turnFace(target, {
                from: item.turnFrom,
                node: item.turnNode,
                delay: item.delay,
                duration: slap ? slapConfig.move : duration
            });
        }

        if (flies || item.turnFrom) {
            landHighlight(target, { delay: item.delay, duration, reveal: item.reveal });
        }

        if (flies) {
            const land = performance.now() + item.delay + duration;
            flights.set(item.uuid, {
                end: target === item.el ? land : Infinity,
                land,
                copy: target === item.el ? null : target,
                to: item.now,
                shift: { x: 0, y: 0 }
            });
            if (slap) {
                bounceCard(target, item);
            } else {
                liftCard(target, item);
            }
        }

        const landing = landingFrames(item, slap ? slapShare * 0.85 : undefined);
        if (landing) {
            target.animate(landing, {
                id: 'flip',
                duration,
                easing,
                delay: item.delay,
                fill: 'backwards'
            });
        }
        const landed = () => {
            if (target !== item.el && flights.get(item.uuid)?.copy === target) {
                flights.delete(item.uuid);
            }
            showLabel();
        };
        (settle() ?? settledFlight(target)).then(landed, landed);
    }
};
