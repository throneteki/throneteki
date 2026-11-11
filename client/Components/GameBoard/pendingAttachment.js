// An attachment whose target is still being chosen is shown on the board, not in the hand
export const findPendingAttachment = (hand) => hand?.find((card) => card.beingAttached);

export const withoutPendingAttachment = (hand) => {
    const pending = findPendingAttachment(hand);
    return pending ? hand.filter((card) => card !== pending) : hand;
};
