describe('Calm Over Westeros', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            firstPlayer: 'player2',
            player1: { plotDeck: ['Calm Over Westeros'], inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['The Tickler'] }
        });
        this.player1.selectPlot('Calm Over Westeros');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player2);
        this.player1.clickPrompt('Military');
        this.completeMarshalPhase();
    });

    it('reduces the claim of challenges of the named type in which you defend', function () {
        this.unopposedChallenge(this.player2, 'Military', this.theTickler);

        expect(this.player1).not.toHavePrompt('Select 1 character to fulfill military claim');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not reduce the claim of other challenge types', function () {
        this.unopposedChallenge(this.player2, 'Intrigue', this.theTickler);

        expect(this.player1Object.discardPile).toHaveLength(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
