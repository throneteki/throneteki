describe('Throwing Axe', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: "Black Wind's Crew", attachments: ['Throwing Axe'] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackWindsCrew);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.throwingAxe);
        this.player1.clickCard(this.burnedMen);
    });

    it('sacrifices itself to kill a defending character after you win a challenge the attached character is attacking in', function () {
        expect(this.throwingAxe.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
