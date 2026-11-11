describe("King's Landing Mob (TSoW)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["King's Landing Mob (TSoW)"]
            },
            player2: {
                inPlay: ['Heart Tree Grove']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.kingsLandingMob);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.heartTreeGrove);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('kills itself to discard a location knelt by assault', function () {
        this.player1.triggerAbility(this.kingsLandingMob);

        expect(this.kingsLandingMob.location).toBe('dead pile');
        expect(this.heartTreeGrove.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
