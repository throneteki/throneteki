describe('The Defiance of Duskendale (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Defiance of Duskendale (AHaH)',
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

    it('discards a location after it is knelt by assault', function () {
        this.player1.triggerAbility(this.theDefianceOfDuskendale);

        expect(this.heartTreeGrove.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
