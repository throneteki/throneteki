import { holdDecision, holdToDrag } from '../../client/Components/GameBoard/HoldTouchSensor.js';

describe('holdDecision', function () {
    const { hold, distance, tolerance } = holdToDrag;

    it('waits while a finger is held still before the hold is up', function () {
        expect(holdDecision({ elapsed: hold - 1, moved: tolerance }, holdToDrag)).toBe('wait');
    });

    it('lets a finger that moves before the hold is up scroll instead', function () {
        expect(holdDecision({ elapsed: hold - 1, moved: tolerance + 1 }, holdToDrag)).toBe(
            'cancel'
        );
    });

    it('keeps holding the card until the held finger moves far enough', function () {
        expect(holdDecision({ elapsed: hold, moved: distance }, holdToDrag)).toBe('hold');
    });

    it('picks the card up when the held finger moves', function () {
        expect(holdDecision({ elapsed: hold, moved: distance + 1 }, holdToDrag)).toBe('start');
    });
});
