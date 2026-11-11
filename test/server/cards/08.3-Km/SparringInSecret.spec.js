describe('Sparring in Secret', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Sparring in Secret'],
                inPlay: [
                    'Tumblestone Knight',
                    { card: 'Ser Jaime Lannister (Core)', kneeling: true }
                ],
                gold: 1
            }
        });
        this.player1.clickCard(this.sparringInSecret);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('kneels a Knight to stand another Knight', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
