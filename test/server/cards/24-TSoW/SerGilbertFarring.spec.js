describe('Ser Gilbert Farring (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Gilbert Farring (TSoW)', "King's Landing Mob (TSoW)"]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.serGilbertFarring);
        this.player1.clickCard(this.kingsLandingMob);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('gets +1 STR and renown during a challenge in which a participating character has assault', function () {
        expect(this.serGilbertFarring.getStrength()).toBe(5);
        expect(this.serGilbertFarring.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
