describe('plot selection with advance information', function () {
    it('waits for the opponent, keeps their choice fixed, and then lets the viewer choose', function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Bloodraven (ATT)'] },
            player2: { plotDeck: ['A Noble Cause', 'Trading with the Pentoshi'] }
        });
        this.player1.triggerAbility(this.bloodraven);
        expect(this.player1).toHavePrompt('Waiting to look at chosen plots');
        const ownPlot = this.player1.findCardByName('Filler Plot', 'plot deck');
        this.player1.clickCard(ownPlot);
        expect(this.player1Object.selectedPlot).toBeUndefined();
        expect(ownPlot.selected).toBeFalsy();
        this.player2.selectPlot(this.aNobleCause);
        expect(this.game.isCardVisible(this.aNobleCause, this.player1Object)).toBe(true);
        expect(this.player1).toHavePrompt('Select a plot');
        this.player2.clickCard(this.tradingWithThePentoshi);
        expect(this.player2Object.selectedPlot).toBe(this.aNobleCause);
        this.player1.selectPlot(ownPlot);
        this.selectFirstPlayer(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('has the first player break a cycle of two advance-information effects', function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Bloodraven (ATT)'] },
            player2: { inPlay: ['Bloodraven (ATT)'] }
        });
        for (let i = 0; i < 2; ++i) {
            const current = [this.player1, this.player2].find((player) =>
                player.player.getSelectableCards().some((card) => card.name === 'Bloodraven')
            );
            current.triggerAbility(current.findCardByName('Bloodraven', 'play area'));
        }
        const first = [this.player1, this.player2].find((player) =>
            player.hasPrompt('Choose who selects a plot first')
        );
        expect(first).toBeDefined();
        first.clickPrompt('player2');
        expect(this.player1).toHavePrompt('Waiting to look at chosen plots');
        expect(this.player2).toHavePrompt('Select a plot');
        this.player2.selectPlot('Filler Plot');
        expect(this.player1).toHavePrompt('Select a plot');
        this.player1.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });
});
