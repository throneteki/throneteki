describe('The Gold Price', function () {
    it('makes locations you control enter play knelt', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'The Gold Price', hand: ['The Roseroad'] },
            player2: { hand: ['The Kingsroad'] }
        });
        this.player1.clickCard(this.theRoseroad);
        expect(this.theRoseroad.kneeled).toBe(true);
    });

    describe('after a character is discarded at random from an opponent hand', function () {
        function setup(gold) {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    agenda: 'The Gold Price',
                    plot: 'A Feast for Crows',
                    inPlay: ['Courtesan of the Rose'],
                    gold
                },
                player2: { hand: ['Hedge Knight'], gold: 0 }
            });
            this.unopposedChallenge(this.player1, 'Intrigue', this.courtesanOfTheRose);
            this.player1.triggerAbility('The Gold Price');
        }

        it('puts it into play under your control', function () {
            setup.call(this, 5);
            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.hedgeKnight).toBeControlledBy(this.player1);
        });

        it('lets you pay its printed cost at the end of the phase to keep it', function () {
            setup.call(this, 5);
            this.completeChallengesPhase();
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickPrompt('Pay gold');
            expect(this.player1).toAllowAbilityTrigger('A Feast for Crows');
            expect(this.player1Object.gold).toBe(5 - this.hedgeKnight.getPrintedCost());
            expect(this.hedgeKnight.location).toBe('play area');
        });

        it('or sacrifice it', function () {
            setup.call(this, 5);
            this.completeChallengesPhase();
            this.player1.clickPrompt('Sacrifice');
            expect(this.player1).toAllowAbilityTrigger('A Feast for Crows');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1Object.gold).toBe(5);
        });

        it('only lets you sacrifice it if you cannot pay', function () {
            setup.call(this, 0);
            this.completeChallengesPhase();
            expect(this.player1).toHavePromptButton('Sacrifice');
            expect(this.player1).toHaveDisabledPromptButton('Pay gold');
            this.player1.clickPrompt('Sacrifice');
            expect(this.hedgeKnight.location).toBe('discard pile');
        });
    });
});
