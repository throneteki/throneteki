describe('Rhaegal (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Rhaegal (DotE)',
                    { card: 'Drogon (Core)', kneeling: true },
                    { card: 'Hedge Knight', kneeling: true }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rhaegal);
        this.player1.triggerAbility('Rhaegal');
    });

    it('stands another character, then stands itself if that character is a Dragon', function () {
        this.player1.clickCard(this.drogon);
        expect(this.drogon.kneeled).toBe(false);
        expect(this.rhaegal.kneeled).toBe(false);
    });

    it('does not stand itself for a character without the Dragon or Stormborn trait', function () {
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.rhaegal.kneeled).toBe(true);
    });
});
