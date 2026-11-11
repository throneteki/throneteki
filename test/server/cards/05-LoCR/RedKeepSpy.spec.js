describe('Red Keep Spy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                hand: ['Red Keep Spy', 'Hot Pie (FFH)'],
                inPlay: ['Littlefinger (Core)'],
                gold: 4
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.littlefinger);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.redKeepSpy);
        this.player1.triggerAbility(this.redKeepSpy);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("returns a character with printed cost 3 or lower to its owner's hand after it enters play using ambush, if you have more cards in hand than its controller", function () {
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
