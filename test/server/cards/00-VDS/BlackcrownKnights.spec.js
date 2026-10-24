describe('Blackcrown Knights', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'tyrell', inPlay: ['Blackcrown Knights'], hand: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.blackcrownKnights);
        this.player1.triggerAbility(this.blackcrownKnights);
        this.player1.clickCard(this.burnedMen);
    });

    it('discards a card from your hand to gain 2 power after you win a power challenge it is participating in', function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.blackcrownKnights.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
