describe('Taste the Blood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Counting Coppers',
                hand: ['Taste the Blood'],
                inPlay: ['Bran Stark (BtB)']
            }
        });
        this.completeChallengesPhase();
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.unopposedChallenge(this.player1, 'Intrigue', this.branStark);
        this.handSize = this.player1Object.hand.length;
        this.player1.triggerAbility(this.tasteTheBlood);
    });

    it('kneels your faction card to initiate the when revealed ability of a plot in a used pile after you win an intrigue challenge with a participating Old Gods character', function () {
        this.player1.clickCard(this.countingCoppers);

        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(this.handSize + 2);

        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
