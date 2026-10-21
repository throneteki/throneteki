describe('The Bastard of Godsgrace', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: [{ card: 'The Bastard of Godsgrace', power: 1 }],
                hand: ['A Pit of Snakes'],
                gold: 0
            },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theBastardOfGodsgrace);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theBastardOfGodsgrace);
    });

    it('discards 1 power from himself to reduce the cost of the next card you play or ambush this phase by 2', function () {
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.aPitOfSnakes);
        this.player1.clickCard(this.hotPie);

        expect(this.theBastardOfGodsgrace.power).toBe(0);
        expect(this.aPitOfSnakes.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
