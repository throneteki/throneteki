describe('Salladhor Saan (TC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Salladhor Saan (TC)'], hand: ['Sea Bitch'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.salladhorSaan);
        this.player1.triggerAbility(this.salladhorSaan);
        this.player1.clickCard(this.seaBitch);
    });

    it('puts a Warship location or Weapon attachment into play from your hand after you win a challenge he is participating in', function () {
        expect(this.seaBitch.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
