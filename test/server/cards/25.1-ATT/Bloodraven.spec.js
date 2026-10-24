describe('Bloodraven (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Bloodraven (ATT)'] },
            player2: { plotDeck: ['A Noble Cause', 'Filler Plot'] }
        });
        this.player1.triggerAbility('Bloodraven');
    });

    it("sacrifices itself to look at an opponent's chosen plot before you choose yours", function () {
        expect(this.bloodraven.location).toBe('discard pile');
        this.player2.selectPlot('A Noble Cause');
        expect(this.game.isCardVisible(this.aNobleCause, this.player1Object)).toBe(true);
    });

    it("does not expose the viewer's unrevealed plots to the chosen opponent", function () {
        // The viewer chooses after the chosen opponent (Bloodraven FAQ, 31 January 2024).
        expect(this.player1).toHavePrompt('Waiting to look at chosen plots');
        expect(this.game.isCardVisible(this.player1Object.plotDeck[0], this.player2Object)).toBe(
            false
        );
    });
});
