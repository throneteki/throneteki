describe("The Queen's Assassin", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight'],
                hand: ["The Queen's Assassin", 'Dragon Sight'],
                gold: 4
            },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theQueensAssassin);
        this.player1.triggerAbility(this.theQueensAssassin);
        this.player2.clickCard(this.hotPie);
    });

    it('makes an opponent with fewer cards in hand choose and kill a character after it enters play using ambush', function () {
        expect(this.theQueensAssassin.location).toBe('play area');
        expect(this.hotPie.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
