describe('Kingsmoot Claimant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Kingsmoot Claimant']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.kingsmootClaimant);
        this.player1.clickPrompt('Done');
    });

    it('gains the King trait and renown while attacking an opponent who controls no King', function () {
        expect(this.kingsmootClaimant.hasTrait('King')).toBe(true);
        expect(this.kingsmootClaimant.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
