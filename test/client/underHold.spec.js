import { createUnderHold, underHoldConfig } from '../../client/Components/GameBoard/underHold.js';

describe('createUnderHold', function () {
    const { delay, tolerance } = underHoldConfig;

    beforeEach(function () {
        vi.useFakeTimers();
        this.armed = [];
        this.hold = createUnderHold({ onArm: (uuid) => this.armed.push(uuid) });
        this.last = () => this.armed[this.armed.length - 1];
    });

    afterEach(function () {
        vi.useRealTimers();
    });

    it('arms a card held still over it for the whole wait', function () {
        this.hold.track({ x: 10, y: 10 }, 'card-1');
        vi.advanceTimersByTime(delay - 1);
        expect(this.last()).toBeNull();

        vi.advanceTimersByTime(1);
        expect(this.last()).toBe('card-1');
    });

    it('stays armed through a small wobble', function () {
        this.hold.track({ x: 10, y: 10 }, 'card-1');
        vi.advanceTimersByTime(delay);
        this.hold.track({ x: 10 + tolerance, y: 10 }, 'card-1');

        expect(this.last()).toBe('card-1');
    });

    it('disarms and waits again when the card is moved', function () {
        this.hold.track({ x: 10, y: 10 }, 'card-1');
        vi.advanceTimersByTime(delay);
        this.hold.track({ x: 11 + tolerance, y: 10 }, 'card-1');
        expect(this.last()).toBeNull();

        vi.advanceTimersByTime(delay);
        expect(this.last()).toBe('card-1');
    });

    it('starts the wait again over another card', function () {
        this.hold.track({ x: 10, y: 10 }, 'card-1');
        vi.advanceTimersByTime(delay - 1);
        this.hold.track({ x: 10, y: 10 }, 'card-2');
        vi.advanceTimersByTime(delay - 1);
        expect(this.last()).toBeNull();

        vi.advanceTimersByTime(1);
        expect(this.last()).toBe('card-2');
    });

    it('never arms over nothing', function () {
        this.hold.track({ x: 10, y: 10 }, null);
        vi.advanceTimersByTime(delay * 2);

        expect(this.armed.every((uuid) => uuid === null)).toBe(true);
    });

    it('disarms when the card is let go', function () {
        this.hold.track({ x: 10, y: 10 }, 'card-1');
        vi.advanceTimersByTime(delay);
        this.hold.reset();
        vi.advanceTimersByTime(delay);

        expect(this.last()).toBeNull();
    });
});
