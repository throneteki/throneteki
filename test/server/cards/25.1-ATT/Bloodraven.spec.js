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

    it('does not show it to an opponent who did not use Bloodraven', function () {
        this.player1.selectPlot('Filler Plot');
        expect(this.game.isCardVisible(this.player1Object.selectedPlot, this.player2Object)).toBe(
            false
        );
    });
});
