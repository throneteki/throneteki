describe('Wheels Within Wheels', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Wheels Within Wheels (OR)'],
                drawDeck: [
                    'Nightmares',
                    'Put to the Sword',
                    ...Array(8).fill('House Maester'),
                    "The Hand's Judgment"
                ]
            }
        });
        this.player1.selectPlot('Wheels Within Wheels');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('reveals searched events, adds one to hand and places the others in the discard pile', function () {
        expect(this.player1).toBeAbleToSelect(this.nightmares);
        expect(this.player1).toBeAbleToSelect(this.putToTheSword);
        expect(this.player1).not.toBeAbleToSelect(this.theHandsJudgment);
        expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.putToTheSword);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Nightmares');
        expect(this.nightmares.location).toBe('hand');
        expect(this.putToTheSword.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows finding no events without forcing a subsequent choice', function () {
        this.player1.clickPrompt('Done');
        expect(this.player1Object.discardPile).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
