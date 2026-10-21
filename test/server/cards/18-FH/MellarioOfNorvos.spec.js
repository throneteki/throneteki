describe('Mellario of Norvos (FH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Mellario of Norvos (FH)',
                    'Doran Martell (Core)',
                    'Quentyn Martell (SoD)',
                    'Trystane Martell (LoCR)'
                ],
                hand: ['Arianne Martell (Core)']
            }
        });
    });

    it('gives Quentyn Martell +2 STR and Trystane Martell insight', function () {
        expect(this.quentynMartell.getStrength()).toBe(this.quentynMartell.cardData.strength + 2);
        expect(this.trystaneMartell.hasKeyword('Insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the cost to marshal Arianne Martell by 1', function () {
        this.player1.clickCard(this.arianneMartell);

        expect(this.arianneMartell.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5 - (this.arianneMartell.getPrintedCost() - 1));
        expect(this.player1).isReadyToTakeAction();
    });
});
