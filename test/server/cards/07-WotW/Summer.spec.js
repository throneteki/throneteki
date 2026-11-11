describe('Summer (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Robb Stark (Core)',
                    { card: 'Arya Stark (Core)', attachments: ['Summer (WotW)'] }
                ],
                gold: 1
            }
        });
    });

    it('kneels the attached character to have it participate in a military challenge on your side', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.player1.clickMenu(this.summer, 'Add attached character to the challenge');
        expect(this.aryaStark.kneeled).toBe(true);
        expect(this.aryaStark.isAttacking()).toBe(true);
    });

    it('pays 1 gold to attach Summer to a different unique Stark character', function () {
        this.player1.clickMenu(this.summer, 'Attach Summer to another character');
        this.player1.clickCard(this.robbStark);
        expect(this.summer.parent).toBe(this.robbStark);
        expect(this.player1Object.gold).toBe(0);
    });
});
