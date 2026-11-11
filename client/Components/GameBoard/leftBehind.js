const piles = [
    'hand',
    'drawDeck',
    'discardPile',
    'deadPile',
    'outOfGamePile',
    'shadows',
    'plotDiscard'
];
const none = [];

// A card that has left play can still hold attachments and duplicates until they leave too (for example
// while the order to discard them in is chosen). They stay on the board, held by an empty place for the card.
export const findLeftBehind = (cardPiles) => {
    const found = piles.flatMap((pile) =>
        (cardPiles?.[pile] || []).filter(
            (card) => card.attachments?.length > 0 || card.dupes?.length > 0
        )
    );
    return found.length > 0 ? found : none;
};

export const rowTypeOf = (card) => {
    if (card.type === 'attachment') {
        return 'character';
    }
    return ['location', 'character'].includes(card.type) ? card.type : 'other';
};
