import { cardBackLike, drawHoldRemaining, flipConfig, flipRemaining, motionOff } from './flip';

export const shuffleConfig = { duration: 800, cards: 2, grow: 1.06, shake: 3 };

// The deck comes a little closer to the viewer and shakes while it is shuffled
export const deckFrames = (config = shuffleConfig) => {
    const at = (offset, x, rotate, scale = config.grow) => ({
        offset,
        transform: `translateX(${x}px) rotate(${rotate}deg) scale(${scale})`
    });

    return [
        at(0, 0, 0, 1),
        at(0.15, 0, 0),
        at(0.3, -config.shake, -1.2),
        at(0.45, config.shake, 1.2),
        at(0.6, -config.shake * 0.6, -0.8),
        at(0.78, 0, 0),
        at(1, 0, 0, 1)
    ];
};

// A card under the top one turns half a circle where it lies, one after another and in opposite directions.
// It is hidden under the top card before and after, so only its corners show while it turns.
export const turnFrames = (index) => {
    const start = 0.1 + index * 0.25;
    const angle = index % 2 ? -180 : 180;
    const turned = (degrees) => ({ transform: `rotate(${degrees}deg)` });

    return [
        { ...turned(0), offset: 0 },
        { ...turned(0), offset: start, easing: 'ease-in-out' },
        { ...turned(angle), offset: Math.min(1, start + 0.5) },
        { ...turned(angle), offset: 1 }
    ];
};

// The cards that turn are the size of the card under the top one. They are always card backs: a card that
// was shown while the deck was searched may still be turning face down when the shuffle starts.
const cardUnderTop = (stack) =>
    stack.querySelector(':scope > :not([data-pile-top]) [data-card-body]') ||
    stack.querySelector('[data-pile-top] [data-card-body]');

export const playShuffle = (deck, delay = 0) => {
    const stack = deck?.querySelector('[data-pile-stack]');
    const top = stack?.querySelector(':scope > [data-pile-top]');
    const under = stack && cardUnderTop(stack);
    const body = under && cardBackLike(under);
    if (!top || !body || !deck.offsetWidth || motionOff()) {
        return;
    }

    // Cards turning face down as the deck is closed finish first, then the deck is shuffled
    const options = {
        duration: shuffleConfig.duration,
        delay: Math.max(delay, flipRemaining(deck)),
        easing: 'ease-in-out'
    };
    for (let index = 0; index < shuffleConfig.cards; index++) {
        const card = document.createElement('div');
        card.style.cssText = `position:absolute;left:0;top:0;width:${top.offsetWidth}px;height:${top.offsetHeight}px;pointer-events:none;border-radius:calc(var(--card-scale, 1) * 0.25rem)`;
        card.append(body.cloneNode(true));
        stack.insertBefore(card, top);
        const turn = card.animate(turnFrames(index), { ...options, easing: 'linear' });
        turn.onfinish = turn.oncancel = () => card.remove();
    }

    deck.animate(deckFrames(), options);
};

const seen = new Map();

// A deck that has been shuffled since the last update is shuffled on the board, once the cards put back
// into it have landed
export const playShuffles = (players) => {
    for (const player of Object.values(players ?? {})) {
        if (player.deckShuffles === undefined) {
            continue;
        }

        const before = seen.get(player.name);
        seen.set(player.name, player.deckShuffles);
        if (before === undefined || player.deckShuffles <= before) {
            continue;
        }

        const hold = drawHoldRemaining();
        playShuffle(
            document.querySelector(`[data-flip-deck="${CSS.escape(player.name)}"]`),
            hold > 0 ? Math.max(0, hold - flipConfig.shuffleGap) : 0
        );
    }
};
