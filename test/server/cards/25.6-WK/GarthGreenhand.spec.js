describe('Garth Greenhand (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Highgarden (BtB)', attachments: ['Garth Greenhand (WK)'] },
                    'The Knight of Flowers (Core)'
                ]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theKnightOfFlowers);
        this.player1.clickPrompt('Done');
    });

    it('gives each unique participating [tyrell] character you control +1 STR, and gives +1 income', function () {
        expect(this.theKnightOfFlowers.getStrength()).toBe(6);
        expect(this.player1Object.getIncome()).toBe(6);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
