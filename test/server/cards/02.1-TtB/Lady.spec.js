describe('Lady (TtB)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Robb Stark (Core)', attachments: ['Lady (TtB)'] },
                    { card: 'Sansa Stark (Core)', kneeling: true },
                    'Arya Stark (Core)'
                ],
                gold: 2
            }
        });
    });

    it('gives the attached character +2 STR', function () {
        expect(this.robbStark.getStrength()).toBe(7);
    });

    it('pays 1 gold to attach Lady to a different character', function () {
        this.player1.clickMenu(this.lady, 'Attach Lady to another character');
        expect(this.player1).not.toAllowSelect(this.robbStark);
        this.player1.clickCard(this.aryaStark);
        expect(this.lady.parent).toBe(this.aryaStark);
        expect(this.player1Object.gold).toBe(1);
    });

    it('then stands Sansa Stark if she is the attached character', function () {
        this.player1.clickMenu(this.lady, 'Attach Lady to another character');
        this.player1.clickCard(this.sansaStark);
        expect(this.lady.parent).toBe(this.sansaStark);
        expect(this.sansaStark.kneeled).toBe(false);
    });
});
