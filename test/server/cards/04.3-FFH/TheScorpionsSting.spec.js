describe("The Scorpion's Sting", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                usedPlots: ['A Noble Cause'],
                inPlay: ['House Dayne Knight'],
                hand: ["The Scorpion's Sting"]
            },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.robbStark);
        this.player1.triggerAbility("The Scorpion's Sting");
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gives up to X martell characters renown, where X is the number of plots in your used pile', function () {
        expect(this.houseDayneKnight.hasKeyword('Renown')).toBe(true);
    });
});
