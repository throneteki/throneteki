describe('Shaggydog (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Shaggydog (WotN)', 'Rickon Stark']
            }
        });
    });

    it('gives Rickon Stark +2 STR and a [military] icon', function () {
        expect(this.rickonStark.getStrength()).toBe(this.rickonStark.cardData.strength + 2);
        expect(this.rickonStark.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
