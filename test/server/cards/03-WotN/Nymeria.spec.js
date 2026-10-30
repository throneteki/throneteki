describe('Nymeria (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Robb Stark (Core)', attachments: ['Nymeria (WotN)'] },
                    'Arya Stark (Core)',
                    'Winterfell Steward'
                ],
                gold: 1
            }
        });
    });

    it('gives the attached character intimidate', function () {
        expect(this.robbStark.hasKeyword('Intimidate')).toBe(true);
    });

    it('pays 1 gold to attach Nymeria to a different unique Stark character', function () {
        this.player1.clickMenu(this.nymeria, 'Attach Nymeria to another character');
        expect(this.player1).not.toAllowSelect(this.winterfellSteward);
        expect(this.player1).not.toAllowSelect(this.robbStark);
        this.player1.clickCard(this.aryaStark);
        expect(this.nymeria.parent).toBe(this.aryaStark);
        expect(this.aryaStark.hasKeyword('Intimidate')).toBe(true);
        expect(this.robbStark.hasKeyword('Intimidate')).toBe(false);
        expect(this.player1Object.gold).toBe(0);
    });
});
