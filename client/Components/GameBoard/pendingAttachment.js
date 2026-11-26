const pilesWithCards = ['hand', 'drawDeck', 'discardPile', 'deadPile', 'outOfGamePile', 'shadows'];

// An attachment whose target is still being chosen is shown on the board, not in the pile it came from
export const findPendingAttachment = (cardPiles) => {
    for (const pile of pilesWithCards) {
        const pending = cardPiles?.[pile]?.find((card) => card.beingAttached);
        if (pending) {
            return pending;
        }
    }
};

export const withoutPendingAttachment = (cards) =>
    cards?.some((card) => card.beingAttached) ? cards.filter((card) => !card.beingAttached) : cards;
