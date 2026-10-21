describe('The Vale of Arryn (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'The Vale of Arryn (AHaH)', kneeling: true },
                    'Knights of the Vale (AHaH)',
                    'Ser Jaime Lannister (Core)'
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.knightsOfTheVale);
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.theValeOfArryn);
    });

    it('gives a participating House Arryn character 2 power while kneeling after you win by 5 or more STR', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.knightsOfTheVale);

        expect(this.knightsOfTheVale.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
