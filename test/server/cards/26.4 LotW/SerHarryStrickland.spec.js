describe('Ser Harry Strickland', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Ser Harry Strickland (LotW)'],
                inPlay: [{ card: 'Zollo the Fat', kneeling: true }],
                gold: 10
            }
        });
        this.player1.clickCard(this.serHarryStrickland);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility('Ser Harry Strickland');
        this.player1.clickCard(this.zolloTheFat);
        this.player1.clickPrompt('Power');
    });

    it('stands a Mercenary character after it enters play and gives it a challenge icon until the end of the phase', function () {
        expect(this.zolloTheFat.kneeled).toBe(false);
        expect(this.zolloTheFat.hasIcon('power')).toBe(true);
    });
});
