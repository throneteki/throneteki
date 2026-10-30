describe('Haunted Forest Scout', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Haunted Forest Scout', 'Ranging Party', 'Ser Jaremy Rykker']
            },
            player2: {
                inPlay: ['Haunted Forest Scout', 'Tumblestone Knight']
            }
        });
    });

    it('cannot be declared as a defender, and does not kneel when attacking while you control 3 or more Rangers', function () {
        const [mine, theirs] = this.game.allCards.filter(
            (card) => card.name === 'Haunted Forest Scout'
        );
        this.player1.clickPrompt('Military');
        this.player1.clickCard(mine);
        this.player1.clickPrompt('Done');

        expect(mine.kneeled).toBe(false);

        this.skipActionWindow();

        expect(this.player2).not.toBeAbleToSelect(theirs);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
