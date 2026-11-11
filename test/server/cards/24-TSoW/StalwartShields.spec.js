describe('Stalwart Shields (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Stalwart Shields (TSoW)']
            },
            player2: {
                inPlay: ["King's Landing Mob (TSoW)"]
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.stalwartShields);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.kingsLandingMob);
        this.player2.clickPrompt('Done');
    });

    it("makes each opponent's Army character lose all keywords while it participates", function () {
        expect(this.kingsLandingMob.hasKeyword('Assault')).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
