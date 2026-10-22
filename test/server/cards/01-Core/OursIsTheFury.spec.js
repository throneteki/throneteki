describe('Ours is the Fury', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Bastard in Hiding', kneeling: true }, 'Robb Stark (Core)'],
                hand: ['Ours is the Fury']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.oursIsTheFury);
        this.player1.clickCard(this.bastardInHiding);
    });

    it('adds a kneeling baratheon character as a defender, and stands it if you win', function () {
        expect(this.game.currentChallenge.isDefending(this.bastardInHiding)).toBe(true);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.bastardInHiding.kneeled).toBe(false);
    });
});
