describe('Choosing the Spear', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Dayne Knight', 'Desert Scavenger'],
                hand: ['Choosing the Spear']
            },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.startingClaim = this.player1Object.getClaim();
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Choosing the Spear');
    });

    it('raises your claim by 1, and has you kill a character you control if you lose', function () {
        expect(this.player1Object.getClaim()).toBe(this.startingClaim + 1);
        this.skipActionWindow();
        this.player2.clickCard(this.robbStark);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.desertScavenger);
        expect(this.desertScavenger.location).toBe('dead pile');
    });
});
