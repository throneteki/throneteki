describe('Exchange of Information', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Exchange of Information'],
                drawDeck: ['Hedge Knight', 'The Roseroad', "Widow's Wail", 'Consolidation of Power']
            }
        });
        this.player1.selectPlot('Exchange of Information');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickCard(this.widowsWail);
        this.player2.clickCard(this.consolidationOfPower);
    });

    it("reveals the top 10 cards of your deck and adds a card of each type of the opponent's choice to your hand", function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.widowsWail.location).toBe('hand');
        expect(this.consolidationOfPower.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Exchange of Information when revealed cards move before the choice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Exchange of Information'],
                drawDeck: [
                    'Alla Tyrell (BtB)',
                    'Hedge Knight',
                    'Beneath the Petals (WoW)',
                    'Consolidation of Power',
                    'The Roseroad',
                    "Widow's Wail"
                ]
            }
        });
        this.player1.selectPlot('Exchange of Information');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.allaTyrell);
        this.player1.triggerAbility(this.beneathThePetals);
    });

    it('only lets the opponent choose among the cards still in the deck', function () {
        expect(this.allaTyrell.location).toBe('play area');
        expect(this.beneathThePetals.location).toBe('shadows');

        expect(this.player2).not.toBeAbleToSelect(this.allaTyrell);
        expect(this.player2).toBeAbleToSelect(this.hedgeKnight);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickCard(this.widowsWail);

        expect(this.player2).not.toBeAbleToSelect(this.beneathThePetals);
        expect(this.player2).toBeAbleToSelect(this.consolidationOfPower);
        this.player2.clickCard(this.consolidationOfPower);

        expect(this.allaTyrell.location).toBe('play area');
        expect(this.beneathThePetals.location).toBe('shadows');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.consolidationOfPower.location).toBe('hand');
    });
});
