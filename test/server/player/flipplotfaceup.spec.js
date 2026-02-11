import Player from '../../../server/game/player.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'raiseEvent']);

        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.initialise();

        this.selectedPlotSpy = jasmine.createSpyObj('plot', [
            'createSnapshot',
            'moveTo',
            'applyPersistentEffects',
            'hasFlag'
        ]);
        this.selectedPlotSpy.uuid = '111';
        this.selectedPlotSpy.location = 'plot deck';
        this.selectedPlotSpy.controller = this.player;
        this.selectedPlotSpy.owner = this.player;
        this.anotherPlotSpy = jasmine.createSpyObj('plot', [
            'createSnapshot',
            'moveTo',
            'applyPersistentEffects',
            'hasFlag'
        ]);
        this.anotherPlotSpy.uuid = '222';
        this.anotherPlotSpy.location = 'plot deck';
        this.anotherPlotSpy.controller = this.player;
        this.anotherPlotSpy.owner = this.player;

        this.player.selectedPlot = this.selectedPlotSpy;
        this.player.plotDeck = [this.selectedPlotSpy, this.anotherPlotSpy];
    });

    describe('recyclePlots()', function () {
        describe('when there are no plots left', function () {
            beforeEach(function () {
                this.player.activePlot = this.selectedPlotSpy;
                this.player.plotDeck = [];
                this.player.plotDiscard = [this.anotherPlotSpy];
                this.anotherPlotSpy.location = 'revealed plots';

                this.player.recyclePlots();
            });

            it('should move the contents of the used plots pile back to the plots pile', function () {
                expect(this.anotherPlotSpy.moveTo).toHaveBeenCalledWith(
                    'plot deck',
                    undefined,
                    false
                );
                expect(this.player.plotDeck).toContain(this.anotherPlotSpy);
                expect(this.player.plotDiscard).not.toContain(this.anotherPlotSpy);
            });

            it('should not move the just revealed plot to any of the piles', function () {
                expect(this.player.plotDeck).not.toContain(this.selectedPlotSpy);
                expect(this.player.plotDiscard).not.toContain(this.selectedPlotSpy);
            });
        });

        describe('when there are plots left', function () {
            beforeEach(function () {
                this.player.plotDeck = [this.selectedPlotSpy];
                this.player.plotDiscard = [this.anotherPlotSpy];
                this.anotherPlotSpy.location = 'revealed plots';

                this.player.recyclePlots();
            });

            it('should not move the contents of the used plots pile back to the plots pile', function () {
                expect(this.anotherPlotSpy.moveTo).not.toHaveBeenCalledWith('plot deck');
                expect(this.player.plotDeck).not.toContain(this.anotherPlotSpy);
                expect(this.player.plotDiscard).toContain(this.anotherPlotSpy);
            });
        });
    });
});
