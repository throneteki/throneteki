describe("Griffin's Roost Knight", function () {
    describe('when the challenges phase ends without you losing a power challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: "Griffin's Roost Knight", kneeling: true }] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.griffinsRoostKnight);
        });

        it('stands him', function () {
            expect(this.griffinsRoostKnight.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
