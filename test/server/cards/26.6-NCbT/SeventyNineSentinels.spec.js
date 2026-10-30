describe('Seventy-Nine Sentinels', function () {
    describe("during a challenge with a defending Night's Watch character", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['Old Forest Hunter', 'Steward at the Wall'],
                    hand: ['Seventy-Nine Sentinels']
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.oldForestHunter);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Pass');
            this.player1.clickCard(this.seventyNineSentinels);
            this.player1.clickCard(this.stewardAtTheWall);
            this.player1.clickPrompt('Done');
        });

        it("kneels Night's Watch characters with 1 or fewer icons to have them participate on your side", function () {
            expect(this.stewardAtTheWall.kneeled).toBe(true);
            expect(this.stewardAtTheWall.isDefending()).toBe(true);
        });
    });
});
