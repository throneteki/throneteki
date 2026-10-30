describe('Now It Comes To War', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Now It Comes To War', inPlay: ['Robb Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'], hand: ['Castle Guard'], power: 2 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
    });

    it('lets the attacking player apply military claim instead', function () {
        this.player1.clickPrompt('Yes');
        this.player2.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
    });

    it('applies normal claim otherwise', function () {
        this.player1.clickPrompt('No');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1Object.faction.power).toBe(1 + 1);
    });
});
