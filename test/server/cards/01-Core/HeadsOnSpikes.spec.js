describe('Heads on Spikes', function () {
    function reveal(context, hand) {
        context.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Heads on Spikes'], hand: ['House Maester'] },
            player2: { hand }
        });
        context.player1.togglePromptedActionWindow('plot', true);
        context.player1.selectPlot('Heads on Spikes');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    it('discards a character directly to the dead pile and gains exactly two faction power', function () {
        reveal(this, ['Hedge Knight']);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player2Object.discardPile.length).toBe(0);
        expect(this.player2Object.hand.length).toBe(0);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.houseMaester.location).toBe('hand');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });

    it('randomly discards only one card when the opponent has more than one', function () {
        reveal(this, ['Hedge Knight', 'Handmaiden']);
        expect(this.player2Object.deadPile.length).toBe(1);
        expect(this.player2Object.hand.length).toBe(1);
        expect(this.player2Object.discardPile.length).toBe(0);
        expect(this.player1Object.faction.power).toBe(2);
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });

    it('discards a non-character normally without gaining power', function () {
        reveal(this, ['The Roseroad']);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player2Object.deadPile.length).toBe(0);
        expect(this.player1Object.faction.power).toBe(0);
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });

    it('does nothing when the opponents hand is empty', function () {
        reveal(this, []);
        expect(this.player1Object.faction.power).toBe(0);
        expect(this.player2Object.deadPile.length).toBe(0);
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });

    it('still gains two power when Missandei replaces the discard by entering play', function () {
        reveal(this, ['Missandei']);
        this.player2.triggerAbility('Missandei');
        expect(this.missandei.location).toBe('play area');
        expect(this.player2Object.deadPile.length).toBe(0);
        expect(this.player1Object.faction.power).toBe(2);
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
