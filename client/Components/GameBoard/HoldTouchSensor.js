import { TouchSensor } from '@dnd-kit/core';
import { getEventCoordinates } from '@dnd-kit/utilities';

export const holdToDrag = { hold: 250, distance: 10, tolerance: 8 };

// A finger that moves before the hold is up is scrolling. Once held still long enough (when the card is shown),
// moving it picks the card up.
export const holdDecision = ({ elapsed, moved }, { hold, distance, tolerance }) => {
    if (elapsed < hold) {
        return moved > tolerance ? 'cancel' : 'wait';
    }
    return moved > distance ? 'start' : 'hold';
};

// dnd-kit's touch sensor starts a drag either after a hold or after a move, not a hold and then a move
export class HoldTouchSensor extends TouchSensor {
    constructor(props) {
        super(props);
        this.pressedAt = performance.now();
    }

    handleMove(event) {
        if (this.activated) {
            return super.handleMove(event);
        }

        const point = getEventCoordinates(event);
        if (!point || !this.initialCoordinates) {
            return;
        }

        const decision = holdDecision(
            {
                elapsed: performance.now() - this.pressedAt,
                moved: Math.hypot(
                    point.x - this.initialCoordinates.x,
                    point.y - this.initialCoordinates.y
                )
            },
            this.props.options.activationConstraint
        );

        if (decision === 'cancel') {
            this.handleCancel();
            return;
        }
        if (decision === 'wait') {
            return;
        }
        // Held: the board must not scroll from under the card about to be picked up
        if (event.cancelable) {
            event.preventDefault();
        }
        if (decision === 'start') {
            this.handleStart();
        }
    }
}
