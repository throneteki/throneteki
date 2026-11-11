describe('Maester Cressen (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', inPlay: ['Maester Cressen (Core)'] },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });
        this.player1.clickCard(this.maesterCressen);
        this.player1.clickCard(this.littleBird);
    });

    it('kneels to discard a Condition attachment', function () {
        expect(this.maesterCressen.kneeled).toBe(true);
        expect(this.littleBird.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
