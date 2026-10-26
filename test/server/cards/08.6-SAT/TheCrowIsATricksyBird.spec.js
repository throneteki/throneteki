describe('The Crow is a Tricksy Bird', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'thenightswatch', hand: ['The Crow is a Tricksy Bird'], gold: 2 },
            player2: { plotDeck: ['A Noble Cause', 'Trading with the Pentoshi'] }
        });
        this.player1.togglePromptedActionWindow('plot', true);
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.theCrowIsATricksyBird);
    });

    it("kneels your faction card to look at an opponent's plot deck and choose the plot they must reveal next", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).toBeAbleToSelect(this.tradingWithThePentoshi);
        this.player1.clickCard(this.tradingWithThePentoshi);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Filler Plot');
        expect(this.player2Object.activePlot).toBe(this.tradingWithThePentoshi);
    });
});

describe('The Crow is a Tricksy Bird when the chosen plot leaves the plot deck', function () {
    it('no longer forces that plot', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                faction: 'thenightswatch',
                hand: ['The Crow is a Tricksy Bird'],
                plotDeck: ['A Song of Summer', 'A Feast for Crows'],
                gold: 2
            },
            player2: {
                faction: 'martell',
                usedPlots: ['Sneak Attack'],
                plotDeck: ['A Noble Cause', 'You Win Or You Die', 'Trading with the Pentoshi'],
                shadows: ['Ser Gerris Drinkwater']
            }
        });
        this.player1.togglePromptedActionWindow('plot', true);
        this.player1.selectPlot('A Song of Summer');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.theCrowIsATricksyBird);
        this.player1.clickCard(this.youWinOrYouDie);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.serGerrisDrinkwater);
        this.player2.triggerAbility(this.serGerrisDrinkwater);
        this.player2.clickCard(this.youWinOrYouDie);
        this.player2.clickCard(this.sneakAttack);
        this.player2.clickPrompt('Done');
        this.completeChallengesPhase();
        this.player1.selectPlot('A Feast for Crows');
        this.player2.selectPlot('Trading with the Pentoshi');

        expect(this.youWinOrYouDie.location).toBe('revealed plots');
        expect(this.player2Object.activePlot).toBe(this.tradingWithThePentoshi);
    });
});
