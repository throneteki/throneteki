describe('The Tickler', function () {
    function setup(context, copies = true) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Tickler', ...(copies ? ['The Roseroad'] : [])] },
            player2: {
                inPlay: copies ? ['The Roseroad', 'Hedge Knight'] : ['Hedge Knight'],
                drawDeck: ['The Roseroad', 'House Maester']
            }
        });
        context.ownCopy = copies
            ? context.player1.findCardByName('The Roseroad', 'play area')
            : undefined;
        context.enemyCopy = copies
            ? context.player2.findCardByName('The Roseroad', 'play area')
            : undefined;
        context.topCard = context.player2.findCardByName('The Roseroad', 'draw deck');
        context.player1.togglePromptedActionWindow('dominance', true);
        context.completeChallengesPhase();
        context.player1.clickCard(context.theTickler);
    }

    it('discards the top card and allows a copy controlled by either player', function () {
        setup(this);
        expect(this.topCard.location).toBe('discard pile');
        expect(this.theTickler.kneeled).toBe(true);
        expect(this.player1).toBeAbleToSelect(this.ownCopy);
        expect(this.player1).toBeAbleToSelect(this.enemyCopy);
        expect(this.player1).not.toBeAbleToSelect(this.theTickler);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.enemyCopy);
        expect(this.enemyCopy.location).toBe('discard pile');
        expect(this.ownCopy.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('allows declining the optional discard from play', function () {
        setup(this);
        this.player1.clickPrompt('Done');
        expect(this.topCard.location).toBe('discard pile');
        expect(this.ownCopy.location).toBe('play area');
        expect(this.enemyCopy.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('finishes without a selection when there is no copy in play', function () {
        setup(this, false);
        expect(this.topCard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
