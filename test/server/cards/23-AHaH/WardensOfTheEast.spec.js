describe('Wardens of the East', function () {
    function setup(context, plot) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                plot,
                hand: ['Winter Is Coming', 'Defiance'],
                inPlay: ['Hedge Knight', { card: 'House Maester', kneeling: true }],
                shadows: ['A Very Large Shadow']
            },
            player2: {
                faction: 'lannister',
                hand: ['Hear Me Roar!', 'Lannisport Merchant']
            }
        });
    }

    describe('while revealed', function () {
        beforeEach(function () {
            setup(this, 'Wardens of the East');
        });

        it('reveals each card in shadows', function () {
            expect(this.aVeryLargeShadow.location).toBe('shadows');
            expect(
                this.game.cardVisibility.isVisible(this.aVeryLargeShadow, this.player2Object)
            ).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops each player playing an in-faction event, and still allows a neutral event', function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');

            expect(this.player1.actionUnavailableReason(this.winterIsComing)).toBe('cost');
            this.player1.clickCard(this.defiance);
            this.player1.clickCard(this.houseMaester);

            expect(this.defiance.location).toBe('discard pile');
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.winterIsComing.location).toBe('hand');

            expect(this.player2.actionUnavailableReason(this.hearMeRoar)).toBe('cost');
            expect(this.hearMeRoar.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('while not revealed', function () {
        beforeEach(function () {
            setup(this);
        });

        it('leaves cards in shadows hidden from the opponent', function () {
            expect(
                this.game.cardVisibility.isVisible(this.aVeryLargeShadow, this.player2Object)
            ).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows an in-faction event during a challenge', function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');

            expect(this.player1.actionUnavailableReason(this.winterIsComing)).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
