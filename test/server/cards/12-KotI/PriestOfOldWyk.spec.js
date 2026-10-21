describe('Priest of Old Wyk', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Priest of Old Wyk', kneeling: true }],
                deadPile: ['Priest of the Drowned God (NMG)']
            }
        });
    });

    it('contributes its STR to dominance while kneeling if there is a Drowned God character in your dead pile', function () {
        expect(this.player1Object.getDominance()).toBe(this.player1Object.gold + 4);
        expect(this.player1).isReadyToTakeAction();
    });
});
