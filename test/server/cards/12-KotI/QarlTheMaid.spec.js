describe('Qarl the Maid', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Qarl the Maid', { card: 'Iron Fleet Scout', kneeling: true }]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.qarlTheMaid);
        this.player1.triggerAbility(this.qarlTheMaid);
        this.player1.clickCard(this.ironFleetScout);
    });

    it('stands a Warship location or Asha Greyjoy after you win a challenge he is participating in', function () {
        expect(this.ironFleetScout.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
