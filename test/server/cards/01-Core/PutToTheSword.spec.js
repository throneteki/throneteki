describe('Put to the Sword', function () {
    function military(context, attackers) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                gold: 2,
                hand: ['Put to the Sword'],
                inPlay: ['Hedge Knight', 'Tumblestone Knight', 'Bastard in Hiding']
            },
            player2: {
                inPlay: ['House Maester', 'Winterfell Steward']
            }
        });

        context.player1.clickPrompt('Military');
        for (const attacker of attackers(context)) {
            context.player1.clickCard(attacker);
        }
        context.player1.clickPrompt('Done');
        context.skipActionWindow();
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
    }

    describe('after you win a [military] challenge by 5 or more STR as the attacking player', function () {
        beforeEach(function () {
            military(this, (context) => [
                context.hedgeKnight,
                context.tumblestoneKnight,
                context.bastardInHiding
            ]);
        });

        it('kills a character controlled by the losing opponent', function () {
            this.player1.triggerAbility(this.putToTheSword);

            expect(this.player1).toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.putToTheSword.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 plays Put to the Sword to kill House Maester'
            );

            this.player2.clickCard(this.winterfellSteward);

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after winning by less than 5 STR', function () {
        beforeEach(function () {
            military(this, (context) => [context.tumblestoneKnight]);
        });

        it('cannot be played', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.putToTheSword);

            this.player2.clickCard(this.winterfellSteward);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
