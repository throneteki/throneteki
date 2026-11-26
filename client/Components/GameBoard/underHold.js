export const underHoldConfig = { delay: 500, tolerance: 6 };

// The card in play under a point on the board, leaving out the card being carried and a card it already lies under
export const cardInPlayAt = ({ x, y }, carriedUuid, root = document) => {
    const card = root.elementFromPoint(x, y)?.closest('[data-flip][data-flip-source="play area"]');
    if (!card || card.dataset.flip === carriedUuid) {
        return null;
    }
    const alreadyUnder = card.querySelector(`.underneath [data-flip="${CSS.escape(carriedUuid)}"]`);
    return alreadyUnder ? null : card.dataset.flip;
};

// A carried card held still over a card for a while is armed to go underneath it. Moving it, or moving onto
// another card, disarms it and starts the wait again.
export const createUnderHold = ({ onArm, config = underHoldConfig }) => {
    let held = { uuid: null, x: 0, y: 0 };
    let timer = null;

    const reset = () => {
        clearTimeout(timer);
        timer = null;
        held = { uuid: null, x: 0, y: 0 };
        onArm(null);
    };

    const track = (point, uuid) => {
        const moved = Math.hypot(point.x - held.x, point.y - held.y) > config.tolerance;
        if (uuid === held.uuid && !moved) {
            return;
        }

        clearTimeout(timer);
        onArm(null);
        held = { uuid, x: point.x, y: point.y };
        timer = uuid ? setTimeout(() => onArm(uuid), config.delay) : null;
    };

    return { track, reset };
};
