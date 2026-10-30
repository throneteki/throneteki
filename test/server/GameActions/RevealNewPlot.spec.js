import RevealNewPlot from '../../../server/game/GameActions/RevealNewPlot.js';
import RevealPlots from '../../../server/game/gamesteps/revealplots.js';

describe('RevealNewPlot', function () {
    beforeEach(function () {
        this.game = { queueStep: vi.fn() };
        this.player = { game: this.game };
        this.plot = {
            getType: () => 'plot',
            allowGameAction: () => true,
            location: 'plot deck',
            controller: this.player
        };
    });

    describe('allow()', function () {
        it('returns true for a plot in the plot deck', function () {
            expect(RevealNewPlot.allow({ card: this.plot })).toBe(true);
        });

        it('returns false for a plot that is not in the plot deck', function () {
            this.plot.location = 'revealed plots';
            expect(RevealNewPlot.allow({ card: this.plot })).toBe(false);
        });
    });

    describe('createEvent()', function () {
        it('selects the plot and queues its reveal', function () {
            const parentEvent = {};
            const event = RevealNewPlot.createEvent({ card: this.plot, parentEvent });

            expect(event.name).toBe('onNewPlotChosen');
            event.executeHandler();

            expect(this.player.selectedPlot).toBe(this.plot);
            const step = this.game.queueStep.mock.calls[0][0];
            expect(step).toBeInstanceOf(RevealPlots);
            expect(step.plots).toEqual([this.plot]);
            expect(step.parentEvent).toBe(parentEvent);
        });
    });
});
