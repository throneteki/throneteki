describe('Drowned Prophet', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Drowned Prophet'],
                drawDeck: ['Salty Navigator']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.drownedProphet);
    });

    it('searches the top 5 cards for a [greyjoy] character and places it in your dead pile when it is killed', function () {
        this.player1.triggerAbility(this.drownedProphet);
        this.player1.clickCard(this.saltyNavigator);

        expect(this.saltyNavigator.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
