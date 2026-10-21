import InitiateWhenRevealed from '../../../server/game/GameActions/InitiateWhenRevealed.js';

describe('InitiateWhenRevealed', function () {
    beforeEach(function () {
        this.newContext = { player: 'plot owner' };
        this.whenRevealed = { createContext: vi.fn().mockReturnValue(this.newContext) };
        this.plot = { getWhenRevealedAbility: vi.fn().mockReturnValue(this.whenRevealed) };
        this.game = { resolveAbility: vi.fn() };
        this.context = { game: this.game, player: 'current player', event: 'reveal event' };
        this.props = { plot: this.plot, context: this.context };
    });

    describe('allow()', function () {
        it('returns true when the plot has a When Revealed ability', function () {
            expect(InitiateWhenRevealed.allow(this.props)).toBe(true);
        });

        it('returns false when the plot has no When Revealed ability', function () {
            this.plot.getWhenRevealedAbility.mockReturnValue(undefined);

            expect(InitiateWhenRevealed.allow(this.props)).toBe(false);
        });

        it('returns false when there is no plot', function () {
            expect(InitiateWhenRevealed.allow({ context: this.context })).toBe(false);
        });
    });

    describe('createEvent()', function () {
        it('creates an onWhenRevealedInitiated event for the current player', function () {
            const event = InitiateWhenRevealed.createEvent(this.props);

            expect(event.name).toBe('onWhenRevealedInitiated');
            expect(event.plot).toBe(this.plot);
            expect(event.player).toBe('current player');
        });

        it('resolves the When Revealed ability as if the player had just revealed it', function () {
            const event = InitiateWhenRevealed.createEvent(this.props);
            event.executeHandler();

            expect(this.whenRevealed.createContext).toHaveBeenCalledWith('reveal event');
            expect(this.newContext.player).toBe('current player');
            expect(this.game.resolveAbility).toHaveBeenCalledWith(
                this.whenRevealed,
                this.newContext
            );
        });

        it('resolves it for the given player when one is passed', function () {
            const event = InitiateWhenRevealed.createEvent({ ...this.props, player: 'other' });
            event.executeHandler();

            expect(this.newContext.player).toBe('other');
        });
    });
});
