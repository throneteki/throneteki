describe('Qarth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    'Qarth',
                    { card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }
                ],
                gold: 1
            }
        });
        this.player1.clickCard(this.qarth);
        this.player1.clickCard(this.littleBird);
    });

    it('kneels and pays 1 gold to discard an attachment on a card you control', function () {
        expect(this.qarth.kneeled).toBe(true);
        expect(this.littleBird.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
