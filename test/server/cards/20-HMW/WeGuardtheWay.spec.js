describe('We Guard the Way', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Castle Guard', 'Dothraki Honor Guard'],
                hand: ['We Guard the Way']
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.weGuardTheWay);
        this.player1.selectValue(1);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('gives X Guard characters renown and has them not kneel when declared as defenders', function () {
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
        expect(this.castleGuard.hasKeyword('Renown')).toBe(true);
        expect(this.dothrakiHonorGuard.hasKeyword('Renown')).toBe(false);
    });
});
