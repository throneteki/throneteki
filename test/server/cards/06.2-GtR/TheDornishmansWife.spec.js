describe("The Dornishman's Wife (GtR)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['"The Dornishman\'s Wife" (GtR)'],
                drawDeck: ['The Roseroad'],
                gold: 1
            },
            player2: { power: 3, hand: ['Hedge Knight'], inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.theDornishmansWife);
    });

    it('gains 2 gold, 1 power and draws 1 card when the opponent has more power, cards in hand and characters', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.theRoseroad.location).toBe('hand');
    });
});
