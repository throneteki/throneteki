describe('Tarred Heads', function () {
    function win(context, card) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['House Maester'], hand: ['Tarred Heads'], gold: 3 },
            player2: { hand: [card] }
        });
        context.unopposedChallenge(context.player1, 'Power', context.houseMaester);
        context.player1.triggerAbility('Tarred Heads');
    }

    it('discards a character directly to its owners dead pile', function () {
        win(this, 'Hedge Knight');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player2Object.discardPile.length).toBe(0);
        expect(this.player2Object.hand.length).toBe(0);
        expect(this.tarredHeads.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('discards a non-character to the discard pile', function () {
        win(this, 'The Roseroad');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player2Object.deadPile.length).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('honors Missandeis replacement instead of moving her back out of play', function () {
        win(this, 'Missandei');
        this.player2.triggerAbility('Missandei');
        expect(this.missandei.location).toBe('play area');
        expect(this.player2Object.deadPile.length).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not offered for a military win', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ranging Party'], hand: ['Tarred Heads'], gold: 3 },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rangingParty);
        expect(this.player1).not.toAllowAbilityTrigger('Tarred Heads');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
