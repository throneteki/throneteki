describe('No Godless Man', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Raiding Khalasar', 'Drowned Men'],
                hand: ['No Godless Man'],
                drawDeck: ['Hedge Knight']
            },
            player2: { hand: ['Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Power', [this.raidingKhalasar, this.drownedMen]);
        this.player1.triggerAbility('No Godless Man');
    });

    it('draws 1 card and discards 1 card at random from the loser for every 5 STR it won by', function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
