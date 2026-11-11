describe('Seal of the Hand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    {
                        card: 'Eddard Stark (Core)',
                        kneeling: true,
                        attachments: ['Seal of the Hand']
                    }
                ]
            }
        });
        this.player1.clickCard(this.sealOfTheHand);
    });

    it('kneels to stand the attached character', function () {
        expect(this.sealOfTheHand.kneeled).toBe(true);
        expect(this.eddardStark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
