describe('Relentless Assault', function () {
    function attack(context, attackers) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Relentless Assault'],
                inPlay: [
                    'Hedge Knight',
                    'Tumblestone Knight',
                    'Bastard in Hiding',
                    'House Dayne Knight'
                ]
            },
            player2: {
                inPlay: ['Winterfell Steward']
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

    describe('after you win a challenge by 5 or more STR as the attacking player', function () {
        beforeEach(function () {
            attack(this, (context) => [
                context.hedgeKnight,
                context.tumblestoneKnight,
                context.bastardInHiding
            ]);
            this.player1.triggerAbility(this.relentlessAssault);
        });

        it('kneels your faction card', function () {
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 plays Relentless Assault to kneel their faction card'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'Then, player1 may initiate an additional military challenge this phase'
            );

            this.player2.clickCard(this.winterfellSteward);

            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you initiate an additional challenge of that type this phase', function () {
            this.player2.clickCard(this.winterfellSteward);

            expect(this.player1).not.toHaveDisabledPromptButton('Military');

            this.unopposedChallenge(this.player1, 'Military', this.houseDayneKnight);

            expect(this.houseDayneKnight.kneeled).toBe(true);
            expect(this.player1).toHaveDisabledPromptButton('Military');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after winning by less than 5 STR', function () {
        beforeEach(function () {
            attack(this, (context) => [context.houseDayneKnight]);
        });

        it('cannot be played', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.relentlessAssault);

            this.player2.clickCard(this.winterfellSteward);

            expect(this.player1Object.faction.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
