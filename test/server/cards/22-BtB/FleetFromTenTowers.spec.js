describe('Fleet from Ten Towers (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Fleet from Ten Towers (BtB)']
            },
            player2: {
                plot: 'Famine'
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.fleetFromTenTowers);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('gets +3 STR and renown while attacking an opponent whose reserve is 4 or lower', function () {
        expect(this.fleetFromTenTowers.getStrength()).toBe(6);
        expect(this.fleetFromTenTowers.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
