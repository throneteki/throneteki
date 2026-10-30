import SelectPlotPrompt from '../../../server/game/gamesteps/plot/selectplotprompt.js';

describe('plot selection dependencies in melee', function () {
    beforeEach(function () {
        this.players = ['A', 'B', 'C', 'D'].map((name) => ({
            name,
            mustShowPlotSelection: [],
            hasFlag: () => false,
            getSelectableCards: () => [],
            clearSelectableCards: vi.fn()
        }));
        this.game = {
            getPlayers: () => this.players,
            getFirstPlayer: () => this.players[3],
            allCards: [],
            promptWithMenu: vi.fn()
        };
    });

    it('lets independent players choose together and releases a dependency chain in order', function () {
        const [a, b, c, d] = this.players;
        b.mustShowPlotSelection = [a];
        c.mustShowPlotSelection = [b];
        const prompt = new SelectPlotPrompt(this.game);
        expect([a, b, c, d].map((player) => prompt.canChoose(player))).toEqual([
            false,
            false,
            true,
            true
        ]);
        c.selectedPlot = {};
        expect(prompt.canChoose(b)).toBe(true);
        expect(prompt.canChoose(a)).toBe(false);
        b.selectedPlot = {};
        expect(prompt.canChoose(a)).toBe(true);
    });

    it('lets the first player break a three-player cycle without blocking independent choices', function () {
        const [a, b, c, d] = this.players;
        b.mustShowPlotSelection = [a];
        c.mustShowPlotSelection = [b];
        a.mustShowPlotSelection = [c];
        d.selectedPlot = {};
        const prompt = new SelectPlotPrompt(this.game);
        prompt.continue();
        expect(this.game.promptWithMenu.mock.calls[0][0]).toBe(d);
        const choose = this.game.promptWithMenu.mock.calls[0][1].chooseFirst;
        expect(choose(d, 'C')).toBe(true);
        expect(prompt.canChoose(c)).toBe(true);
        expect(prompt.canChoose(a)).toBe(false);
        c.selectedPlot = {};
        expect(prompt.canChoose(b)).toBe(true);
        b.selectedPlot = {};
        expect(prompt.canChoose(a)).toBe(true);
    });
});
