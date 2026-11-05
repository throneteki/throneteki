describe('Archmaester Ebrose', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Archmaester Ebrose',
                    'Maester Lomys',
                    { card: 'Maester Caleotte', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.archmaesterEbrose);
        this.player1.clickCard(this.maesterLomys);
        this.player1.clickCard(this.maesterCaleotte);
    });

    it('kneels a Maester to stand another Maester', function () {
        expect(this.maesterLomys.kneeled).toBe(true);
        expect(this.maesterCaleotte.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
