describe('Valar Dohaeris', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                faction: 'stark',
                plot: 'Valar Dohaeris',
                inPlay: [
                    'Greatjon Umber',
                    'Umber Loyalist',
                    'Hedge Knight',
                    { card: 'Winterfell Steward', attachments: ['Little Bird (Core)'] }
                ]
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.selectPlot('Valar Dohaeris');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('has each player keep characters with a total printed cost of 10 or lower and places the rest on the bottom of their decks', function () {
        this.player1.clickCard(this.greatjonUmber);
        this.player1.clickCard(this.umberLoyalist);
        this.player1.clickCard(this.hedgeKnight);

        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.greatjonUmber.location).toBe('play area');
        expect(this.umberLoyalist.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.winterfellSteward.location).toBe('draw deck');
        expect(this.player1Object.drawDeck.at(-1)).toBe(this.winterfellSteward);
        expect(this.littleBird.location).toBe('hand');
        expect(this.houseMaester.location).toBe('draw deck');
        expect(this.game.getPlainTextLog()).toContain(
            "player1 uses Valar Dohaeris and places Winterfell Steward on the bottom of its owner's deck and places House Maester on the bottom of its owner's deck"
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
