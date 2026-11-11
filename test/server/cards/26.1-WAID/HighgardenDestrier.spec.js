describe('Highgarden Destrier (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Highgarden Destrier (WAID)'] },
                    'Winterfell Steward'
                ]
            }
        });
    });

    it('gives the attached character +1 STR for each character you control with printed cost 3 or lower', function () {
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 2);
    });
});
