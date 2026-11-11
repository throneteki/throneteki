describe('The Sword in the Darkness', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                hand: ['The Sword in the Darkness'],
                inPlay: ['Old Bear Mormont (Core)', 'Old Forest Hunter'],
                gold: 1
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.oldBearMormont);
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.theSwordInTheDarkness);
    });

    it('stops the losing opponent initiating challenges against you this round after you win a challenge by 5 or more STR as the defender', function () {
        expect(this.player2Object.canInitiateChallenge('military', this.player1Object)).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
