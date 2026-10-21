describe("The Spider's Web", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "The Spider's Web",
                inPlay: ['Littlefinger (Core)', 'Maester Aemon (Core)']
            },
            player2: { hand: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.theSpidersWeb);
    });

    it('lets you initiate an additional intrigue challenge with claim raised by 1 after claim is applied for an intrigue challenge you won', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maesterAemon);
        this.player1.clickPrompt('Done');

        expect(this.maesterAemon.isAttacking()).toBe(true);
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
