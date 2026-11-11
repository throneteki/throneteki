describe('Harma Dogshead (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Harma Dogshead (FtR)'],
                drawDeck: ['Tumblestone Knight', 'Bearskin Cloak']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.harmaDogshead);
    });

    it('puts an Item or Weapon attachment with printed cost 2 or lower from the top 10 cards into play after pillaging', function () {
        this.player1.triggerAbility(this.harmaDogshead);
        this.player1.clickCard(this.bearskinCloak);
        this.player1.clickCard(this.harmaDogshead);

        expect(this.bearskinCloak.location).toBe('play area');
        expect(this.bearskinCloak.parent).toBe(this.harmaDogshead);
        expect(this.player1).isReadyToTakeAction();
    });
});
