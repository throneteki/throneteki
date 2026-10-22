describe('The Things I Do For Love', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Cersei Lannister (Core)'],
                hand: ['The Things I Do For Love'],
                gold: 1
            },
            player2: { inPlay: ['Hot Pie (ToJ)'] }
        });
        this.player1.clickCard(this.theThingsIDoForLove);
        this.player1.clickCard(this.hotPie);
    });

    it("kneels your faction card to return a character with printed cost X or lower to its owner's hand", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
