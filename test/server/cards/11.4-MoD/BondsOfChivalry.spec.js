describe('Bonds of Chivalry', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Winged Knight', 'Red-Apple Knight (ATT)'],
                hand: ['Bonds of Chivalry']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.wingedKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.bondsOfChivalry);
        this.player1.clickCard(this.wingedKnight);
    });

    it('stands a participating Knight and removes it from the challenge', function () {
        expect(this.wingedKnight.kneeled).toBe(false);
        expect(this.wingedKnight.isParticipating()).toBe(false);
    });

    it('may then kneel another Knight to have it participate on your side', function () {
        this.player1.clickCard(this.redAppleKnight);
        expect(this.redAppleKnight.kneeled).toBe(true);
        expect(this.redAppleKnight.isAttacking()).toBe(true);
    });
});
