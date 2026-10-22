describe('Irri', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    { card: 'Irri', gold: 1 },
                    { card: 'Margaery Tyrell (Core)', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.irri);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('discards 1 gold to stand a Lord or Lady character', function () {
        expect(this.irri.gold).toBe(0);
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
