describe('Guarding the Realm', function () {
    it("puts a character with printed cost 3 or lower from an opponent's discard pile into play under your control", function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Guarding the Realm'] },
            player2: { discard: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.guardingTheRealm);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.hedgeKnight.controller).toBe(this.player1Object);
    });

    it('pays 1 gold to return itself to your hand after you win a challenge as the defender', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Robb Stark (Core)'], discard: ['Guarding the Realm'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Guarding the Realm');
        expect(this.guardingTheRealm.location).toBe('hand');
    });
});
