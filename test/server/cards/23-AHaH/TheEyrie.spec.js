describe('The Eyrie', function () {
    describe('during a challenge with a participating loyal character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['The Eyrie (AHaH)', 'Catelyn Stark (Core)', 'Tumblestone Knight']
                }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.catelynStark);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.theEyrie, 'Contribute STR');
        });

        it('kneels to contribute 2 STR for each participating character you control', function () {
            expect(this.theEyrie.kneeled).toBe(true);
            expect(this.game.currentChallenge.attackerStrength).toBe(10);
        });
    });
});
