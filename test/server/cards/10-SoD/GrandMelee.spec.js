describe('Grand Melee', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Grand Melee',
                inPlay: ['Tumblestone Knight', 'House Dayne Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'Hedge Knight']
            }
        });
    });

    it('stops a character attacking or defending alone contributing its STR', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.attackerStrength).toBe(0);
        expect(this.game.currentChallenge.defenderStrength).toBe(0);
        expect(this.player1).toHavePrompt('Initiate an action');
    });

    it('lets characters that are not alone contribute their STR', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.attackerStrength).toBe(4);
        expect(this.game.currentChallenge.defenderStrength).toBe(4);
        expect(this.player1).toHavePrompt('Initiate an action');
    });
});
