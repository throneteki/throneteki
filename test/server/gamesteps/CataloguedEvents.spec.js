describe('catalogued events', function () {
    function watchFor(context, eventName) {
        context.seen = [];
        context.houseMaester.reaction({
            when: { [eventName]: () => true },
            handler: (abilityContext) => context.seen.push(abilityContext.event)
        });
        context.houseMaester.abilities.reactions.at(-1).registerEvents();
    }

    describe('onAddedToChallenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        'Nymeria (FotOG)',
                        'Direwolf Pup',
                        'Tumblestone Knight',
                        'House Maester'
                    ]
                }
            });
            watchFor(this, 'onAddedToChallenge');

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.nymeria, 'Add Direwolfs to challenge');
            this.player1.clickCard(this.direwolfPup);
            this.player1.clickPrompt('Done');
        });

        it('lets abilities respond to a card joining a challenge', function () {
            this.player1.triggerAbility(this.houseMaester);
            this.player1.clickCard(this.nymeria);

            expect(this.seen[0].card).toBe(this.nymeria);
            expect(this.seen[0].player).toBe(this.player1Object);
            expect(this.seen[0].challenge).toBe(this.game.currentChallenge);
        });
    });

    describe('onLookAtShadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['"A Thousand Eyes, and One" (WK)'],
                    inPlay: ['House Maester']
                },
                player2: {
                    shadows: ['Tumblestone Knight']
                }
            });
            watchFor(this, 'onLookAtShadows');

            this.player1.clickCard(this.aThousandEyesAndOne);
            this.player1.clickPrompt('Shadows');
            this.player1.clickPrompt('Done');
        });

        it("lets abilities respond to a player looking at an opponent's shadows area", function () {
            this.player1.triggerAbility(this.houseMaester);

            expect(this.seen[0].player).toBe(this.player1Object);
            expect(this.seen[0].opponent).toBe(this.player2Object);
        });
    });

    describe('onTokenDiscarded', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Cragorn (FH)', gold: 1 }, 'House Maester'],
                    drawDeck: ['Throwing Axe']
                }
            });
            watchFor(this, 'onTokenDiscarded');

            this.player1.clickMenu(this.cragorn, 'Search top 10 cards');
            this.player1.clickCard(this.cragorn);
        });

        it('is raised when a cost discards a token', function () {
            this.player1.clickCard(this.throwingAxe);
            this.player1.triggerAbility(this.houseMaester);

            expect(this.cragorn.tokens.gold).toBeUndefined();
            expect(this.seen[0].card).toBe(this.cragorn);
            expect(this.seen[0].token).toBe('gold');
            expect(this.seen[0].amount).toBe(1);
        });
    });

    describe('onCardsDrawn from a specific draw', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Gates of Winterfell', 'House Maester'],
                    drawDeck: ['Winterfell Steward']
                }
            });
            watchFor(this, 'onCardsDrawn');

            this.player1.clickMenu(this.gatesOfWinterfell, 'Reveal top card of deck');
        });

        it('includes the amount drawn', function () {
            this.player1.triggerAbility(this.houseMaester);

            expect(this.winterfellSteward.location).toBe('hand');
            expect(this.seen[0].cards).toEqual([this.winterfellSteward]);
            expect(this.seen[0].amount).toBe(1);
            expect(this.seen[0].desiredAmount).toBe(1);
        });
    });
});
