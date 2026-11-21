import { aroundTheTable } from '../seatOrder';

const onBoard = function* (player) {
    for (const card of player?.cardPiles?.cardsInPlay || []) {
        yield card;
        yield* card.attachments || [];
        yield* card.dupes || [];
    }
};

const hasSelectable = (player) => {
    for (const card of onBoard(player)) {
        if (card.selectable) {
            return true;
        }
    }
    return false;
};

export const nameOf = (player) => player?.user?.username ?? player?.name;

// Whose board a melee table should show: during our prompt, the first opponent round the table from us with a card
// on their board we can choose, else our own board; otherwise the player whose prompt is active; else nobody, and
// the table stays where it is.
export const followTarget = (thisPlayer, otherPlayers) => {
    if (!thisPlayer) {
        return null;
    }
    if (thisPlayer.isActivePrompt) {
        const others = aroundTheTable(thisPlayer, [thisPlayer, ...otherPlayers]).slice(1);
        const choosing = others.find(hasSelectable);
        return nameOf(choosing ?? thisPlayer);
    }
    const acting = otherPlayers.find((player) => player.isActivePrompt);
    return acting ? nameOf(acting) : null;
};

// Whose prompt is active, whoever's it is
export const activePlayerOf = (thisPlayer, otherPlayers) =>
    nameOf([thisPlayer, ...otherPlayers].find((player) => player?.isActivePrompt)) ?? null;
