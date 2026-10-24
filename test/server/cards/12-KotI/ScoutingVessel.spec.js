describe('Scouting Vessel', function () {
    function pillage(context, vessels = 1) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ["Black Wind's Crew", ...Array(vessels).fill('Scouting Vessel')]
            },
            player2: {
                drawDeck: Array(8).fill('Winterfell Steward')
            }
        });

        context.vessels = context.player1.filterCardsByName('Scouting Vessel', 'play area');
        context.unopposedChallenge(context.player1, 'Military', context.blackWindsCrew);
    }

    describe('when a character you control discards a card using pillage', function () {
        beforeEach(function () {
            pillage(this);
        });

        it('kneels and sacrifices itself to discard 3 cards instead', function () {
            this.player1.triggerAbility(this.scoutingVessel);

            expect(this.player2Object.discardPile).toHaveLength(3);
            expect(this.scoutingVessel.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels and sacrifices Scouting Vessel to discard 3 cards with pillage instead of 1'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.player2Object.discardPile).toHaveLength(1);
            expect(this.scoutingVessel.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with more than one Scouting Vessel', function () {
        beforeEach(function () {
            pillage(this, 3);
            this.player1.triggerAbility(this.vessels[0]);
        });

        // Each further Scouting Vessel replaces the discard of one of those cards with 3 more.
        it('lets each one replace one more discard', function () {
            expect(this.player1).toAllowAbilityTrigger(this.vessels[1]);

            this.player1.triggerAbility(this.vessels[1]);
            this.player1.triggerAbility(this.vessels[2]);

            expect(this.player2Object.discardPile).toHaveLength(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
