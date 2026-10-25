describe('Double-Dealing', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Double-Dealing'], inPlay: ['Tumblestone Knight'] },
            player2: {
                plotDeck: ['Filler Plot', 'Famine'],
                usedPlots: ['Famine'],
                hand: ['Tumblestone Knight']
            }
        });
        this.player1.selectPlot('Double-Dealing');
        this.player2.selectPlot('Filler Plot');
    });

    it("gains an opponent's used plot text box until a new plot is revealed", function () {
        expect(this.doubleDealing.location).toBe('active plot');
        expect(this.famine.location).toBe('revealed plots');
        expect(this.famine.controller.activePlot).not.toBe(this.famine);
        expect(this.player1.actionUnavailableReason(this.doubleDealing)).toBe(undefined);
        this.player1.clickMenu(this.doubleDealing, 'Copy a plot card text box');
        expect(this.player1).toBeAbleToSelect(this.famine);
        this.player1.clickCard(this.famine);

        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Done');
        const character = this.player2.findCardByName('Tumblestone Knight', 'hand');
        expect(this.player2Object.getCostReduction('marshal', character)).toBe(-1);
        this.player2.clickCard(character);

        expect(this.player2Object.gold).toBe(2);
        this.player2.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});
