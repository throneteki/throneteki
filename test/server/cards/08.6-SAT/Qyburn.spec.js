describe('Qyburn (SAT)', function () {
    function setup(context, options = {}) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Qyburn (SAT)', kneeling: !!options.kneeling },
                    'Ranging Party',
                    ...(options.sparrow ? ['The High Sparrow'] : [])
                ],
                hand: ['The Roseroad'],
                drawDeck: ['Castle Guard', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Hedge Knight'], hand: ['Winterfell Steward'] }
        });
        context.unopposedChallenge(context.player1, 'Military', context.rangingParty);
        context.player2.clickCard(context.hedgeKnight);
    }

    it('kneels to draw two after a kill, then requires discarding one of your hand cards', function () {
        setup(this);
        expect(this.player1).toAllowAbilityTrigger('Qyburn');
        this.player1.triggerAbility('Qyburn');
        expect(this.qyburn.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.tumblestoneKnight.location).toBe('hand');
        for (const card of [this.theRoseroad, this.castleGuard, this.tumblestoneKnight]) {
            expect(this.player1).toBeAbleToSelect(card);
        }
        for (const card of [
            this.hedgeKnight,
            this.winterfellSteward,
            this.qyburn,
            this.rangingParty
        ]) {
            expect(this.player1).not.toBeAbleToSelect(card);
        }
        expect(this.player1).not.toHavePromptButton('Done');
        expect(this.player1).toBeAbleToSelect(this.theRoseroad);
        this.player1.clickCard(this.theRoseroad);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not discard when a draw limit prevents drawing both cards', function () {
        setup(this, { sparrow: true });
        this.player1.triggerAbility('Qyburn');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.tumblestoneKnight.location).toBe('draw deck');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1Object.hand.length).toBe(2);
        expect(this.qyburn.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not offered when already kneeling', function () {
        setup(this, { kneeling: true });
        expect(this.player1).not.toAllowAbilityTrigger('Qyburn');
        expect(this.castleGuard.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
