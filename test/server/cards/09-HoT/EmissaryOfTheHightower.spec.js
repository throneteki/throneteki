describe('Emissary of the Hightower', function () {
    describe('when playing an event chosen by Emissary', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Trading with the Pentoshi',
                    inPlay: ['Margaery Tyrell (AMAF)'],
                    hand: ['Emissary of the Hightower'],
                    discard: ['Growing Strong']
                }
            });
            this.player1.clickCard(this.emissaryOfTheHightower);
            this.player1.triggerAbility(this.emissaryOfTheHightower);
            this.player1.clickCard(this.growingStrong);
            this.player1.clickCard(this.growingStrong);
            this.player1.clickCard(this.margaeryTyrell);
            this.player1.clickPrompt('Done');
        });

        it('lets you play it from your discard pile, then removes it from the game', function () {
            expect(this.margaeryTyrell.getStrength()).toBe(7);
            expect(this.growingStrong.location).toBe('out of game');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('vs Hidden Thorns', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Trading with the Pentoshi',
                    inPlay: ['Margaery Tyrell (AMAF)', 'The Queen of Thorns (HoT)'],
                    hand: ['Emissary of the Hightower'],
                    discard: ['Hidden Thorns']
                },
                player2: { hand: ['Hedge Knight', 'Varys (Core)'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.clickCard(this.emissaryOfTheHightower);
            this.player1.triggerAbility(this.emissaryOfTheHightower);
            this.player1.clickCard(this.hiddenThorns);
            this.unopposedChallenge(this.player1, 'Intrigue', this.margaeryTyrell);
            this.player1.triggerAbility(this.hiddenThorns);
            this.player2.clickCard(this.hedgeKnight);
            this.player2.clickCard(this.varys);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.completeChallengesPhase();
        });

        it('returns the event to your hand', function () {
            expect(this.hiddenThorns.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('resets where the event is placed for future rounds', function () {
            expect(this.hiddenThorns.eventPlacementLocation).toBe('discard pile');
        });
    });
});
