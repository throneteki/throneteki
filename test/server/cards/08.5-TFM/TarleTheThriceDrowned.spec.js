describe('Tarle the Thrice-Drowned (TFM)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tarle the Thrice-Drowned (TFM)'],
                deadPile: ['Priest of the Drowned God (NMG)'],
                gold: 10
            }
        });
        this.player1.clickCard(this.priestOfTheDrownedGod);
    });

    it('lets you marshal non-unique Drowned God characters from your dead pile', function () {
        expect(this.priestOfTheDrownedGod.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
