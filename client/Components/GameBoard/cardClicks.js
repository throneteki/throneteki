// Whether the server says clicking the card does something now: it can be chosen, or it is the player's own and has
// an action or can be played. In manual mode any click may kneel or stand a card.
export const clickDoesSomething = (card, manualMode) =>
    !!(manualMode || card?.selectable || card?.selected || card?.canPlay);

// Whether clicking the card does something that cannot be taken back: it is played or used, or chosen in a prompt
// that ends on the first card chosen
export const clickActsAtOnce = (card, selectFiresOnClick) =>
    !!(card?.canPlay || (card?.selectable && selectFiresOnClick));
