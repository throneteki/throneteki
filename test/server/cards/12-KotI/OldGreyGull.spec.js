describe('Old Grey Gull', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Old Grey Gull', 'Iron Islands Fishmonger'] }
        });
        this.player1.clickMenu(this.oldGreyGull, 'Kill and return character');
        this.player1.clickCard(this.ironIslandsFishmonger);
    });

    it('kneels to kill another greyjoy character, then may return it from your dead pile to hand', function () {
        this.player1.clickPrompt('Yes');
        expect(this.oldGreyGull.kneeled).toBe(true);
        expect(this.ironIslandsFishmonger.location).toBe('hand');
    });

    it('leaves it in your dead pile if you decline', function () {
        this.player1.clickPrompt('No');
        expect(this.ironIslandsFishmonger.location).toBe('dead pile');
    });
});
