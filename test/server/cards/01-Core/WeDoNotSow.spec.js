describe('We Do Not Sow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                hand: ['We Do Not Sow'],
                inPlay: ["Black Wind's Crew"],
                gold: 1
            },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        this.player1.triggerAbility(this.weDoNotSow);
        this.player1.clickCard(this.sweetCersei);
    });

    it('discards an attachment or location controlled by the losing opponent after you win an unopposed challenge', function () {
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
