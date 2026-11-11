import { cardImageSrc } from './imageCache';

export const flipConfig = {
    duration: 380,
    exitDuration: 200,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    shuffleGap: 600,
    sequenceDuration: 320,
    sequenceStep: 380,
    maxSequence: 2000,
    maxAnimated: 30,
    minDistance: 1
};

const plotDeckPrefix = 'plots:';

const rectOf = (el) => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};

export const measureCards = (root = document) => {
    const cards = new Map();
    root.querySelectorAll('[data-flip]').forEach((el) => {
        const rect = rectOf(el);
        const slotEl = el.querySelector('[data-flip-slot]') || el;
        const slot = rectOf(slotEl);
        cards.set(el.dataset.flip, {
            el,
            ...rect,
            slot,
            slotEl,
            holdsCards: el.querySelector('[data-flip]') !== null,
            from: el.dataset.flipFrom,
            parent: el.parentElement?.closest('[data-flip]')?.dataset.flip,
            source: el.dataset.flipSource,
            rot: Number(el.dataset.flipRot) || 0,
            z: el.dataset.flipZ === undefined ? undefined : Number(el.dataset.flipZ)
        });
    });
    return cards;
};

export const measureDecks = (root = document) => {
    const decks = new Map();
    root.querySelectorAll('[data-flip-deck]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        decks.set(el.dataset.flipDeck, { left: rect.left, top: rect.top });
    });
    return decks;
};

const centre = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

// A card carried back to its place leaves the attachments and duplicates on it where they are
const alone = (was, now) =>
    was.solo && now.holdsCards
        ? { ...now, el: now.slotEl, left: now.slot.left, top: now.slot.top }
        : now;

const planMove = (uuid, was, arrived, config) => {
    const now = alone(was, arrived);
    const turned = was.el !== now.el && was.rot !== now.rot;
    const travel = was.source !== now.source;
    const places = {
        old: { left: was.left, top: was.top },
        now: { left: now.left, top: now.top },
        fromSource: was.source,
        toSource: now.source,
        nested: now.source === 'attached',
        z: now.z
    };
    if (turned) {
        const from = centre(was.slot);
        const to = centre(now.slot);
        return {
            type: 'move',
            uuid,
            el: now.el,
            dx: from.x - to.x,
            dy: from.y - to.y,
            rotate: was.rot - now.rot,
            origin: { x: to.x - now.left, y: to.y - now.top },
            travel,
            ...places
        };
    }

    const dx = was.left - now.left;
    const dy = was.top - now.top;
    if (Math.abs(dx) < config.minDistance && Math.abs(dy) < config.minDistance) {
        return null;
    }

    return { type: 'move', uuid, el: now.el, dx, dy, rotate: 0, travel, ...places };
};

// A hand card that has vanished most likely went back to its owner's draw deck
const returnedToDeck = (was, decks) => {
    const deck = was.source === 'hand' && was.from && decks.get(was.from);
    return deck ? { source: 'draw deck', left: deck.left, top: deck.top } : null;
};

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

    const plan = [];
    for (const [uuid, now] of after) {
        const was = before.get(uuid);
        if (was) {
            const move = planMove(uuid, was, now, config);
            if (move) {
                plan.push(move);
            }
            continue;
        }

        const origin = now.from && decks.get(now.from);
        if (!origin) {
            plan.push({ type: 'fade', uuid, el: now.el, travel: true, toSource: now.source });
            continue;
        }

        plan.push({
            type: 'move',
            uuid,
            el: now.el,
            dx: origin.left - now.left,
            dy: origin.top - now.top,
            rotate: 0,
            travel: true,
            sequential: !now.from.startsWith(plotDeckPrefix),
            old: origin,
            now: { left: now.left, top: now.top },
            toSource: now.source
        });
    }

    for (const [uuid, was] of before) {
        if (after.has(uuid) || !was.el || was.el.isConnected) {
            continue;
        }

        const pile = findPile(uuid) || returnedToDeck(was, decks);
        plan.push(
            pile
                ? {
                      type: 'ghost',
                      el: was.el,
                      rect: was,
                      dx: pile.left - was.left,
                      dy: pile.top - was.top,
                      travel: true,
                      old: { left: was.left, top: was.top },
                      now: { left: pile.left, top: pile.top },
                      fromSource: was.source,
                      toSource: pile.source,
                      depth: pile.depth,
                      returning: pile.source === 'draw deck'
                  }
                : { type: 'exit', el: was.el, rect: was }
        );
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
let host = null;
let ignored = null;
let dropOrigin = null;
const piles = new Map();

export const setFlipIgnored = (uuid) => {
    ignored = uuid;
};

export const setDropOrigin = (origin) => {
    dropOrigin = origin;
};

export const registerPile = (id, entry) => {
    piles.set(id, entry);
    return () => piles.delete(id);
};

const findPile = (uuid) => {
    for (const entry of piles.values()) {
        if (entry.uuids.has(uuid) && entry.el.isConnected) {
            const rect = entry.el.getBoundingClientRect();
            return {
                source: entry.source,
                left: rect.left,
                top: rect.top,
                depth: entry.uuids.get(uuid)
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

const motionOff = () =>
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
            const { uuid, rect, source, rot } = dropOrigin;
            cards.set(uuid, { el: null, ...rect, slot: rect, source, rot, solo: true });
        }
        dropOrigin = null;
        ignored = null;
    }
    pending = cards;
};

const getHost = () => {
    if (!host || !host.isConnected) {
        host = document.createElement('div');
        host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:205';
        document.body.appendChild(host);
    }
    return host;
};

const detach = (el, rect) => {
    el.style.cssText += `;position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;margin:0;transform:none`;
    getHost().appendChild(el);
};

// A card put back into the deck turns over on the way, so it arrives facedown
const turnFacedown = (el, { delay, duration }) => {
    const face = el.querySelector('[data-card-surface] img');
    const back = cardImageSrc('cardback');
    if (!face || face.getAttribute('src') === back) {
        return;
    }

    const rear = face.cloneNode();
    rear.src = back;
    face.after(rear);
    const half = duration / 2;
    face.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
        duration: half,
        delay,
        easing: 'ease-in',
        fill: 'both'
    });
    rear.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: half,
        delay: delay + half,
        easing: 'ease-out',
        fill: 'both'
    });
};

const animateGhost = ({ el, rect, dx, dy, delay, duration, returning }) => {
    detach(el, rect);
    if (returning) {
        turnFacedown(el, { delay, duration });
    }
    const animation = el.animate(
        [{ transform: 'translate(0, 0)' }, { transform: `translate(${dx}px, ${dy}px)` }],
        { duration, delay, easing: flipConfig.easing, fill: 'both' }
    );
    animation.onfinish = () => el.remove();
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
    animation.onfinish = () => el.remove();
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
    const lifted = { zIndex: item.nested ? String(item.z ?? 199) : item.travel ? '205' : '200' };
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
export const landingFrames = (item) =>
    item.type === 'move' && item.travel && !item.nested
        ? [
              { zIndex: '205', offset: 0 },
              { zIndex: '205', offset: landingPoint, easing: 'steps(1, jump-start)' },
              { zIndex: String(restingLevel), offset: 1 }
          ]
        : null;

export const playPendingFlip = (root = document) => {
    const before = pending;
    pending = null;
    if (!before || motionOff()) {
        return;
    }

    root.querySelectorAll('[data-flip]').forEach((el) => {
        el.getAnimations()
            .filter((animation) => animation.id === 'flip')
            .forEach((animation) => animation.cancel());
    });

    const after = measureCards(root);
    if (ignored) {
        before.delete(ignored);
        after.delete(ignored);
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

        item.el.animate(keyframesFor(item), {
            id: 'flip',
            duration: item.duration,
            easing: flipConfig.easing,
            delay: item.delay,
            fill: 'backwards'
        });

        const landing = landingFrames(item);
        if (landing) {
            item.el.animate(landing, {
                id: 'flip',
                duration: item.duration,
                easing: flipConfig.easing,
                delay: item.delay,
                fill: 'backwards'
            });
        }
    }
};
