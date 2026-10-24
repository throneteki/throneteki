describe('Harrenhal (TTWDFL)', function () {
    function useArry(context, ghostTokens) {
        context.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: {
                inPlay: [
                    { card: 'Harrenhal (TTWDFL)', tokens: { ghost: ghostTokens } },
                    'House Maester'
                ]
            },
            player2: {
                faction: 'thenightswatch',
                inPlay: ['Arry']
            }
        });

        context.player2.clickMenu(context.arry, 'Draw 1 card');
    }

    describe('when an opponent initiates a triggered ability', function () {
        beforeEach(function () {
            useArry(this, 0);
        });

        it('kills a character you own and control to cancel its effects and gains a ghost token', function () {
            this.player1.triggerAbility(this.harrenhal);
            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.arry.location).toBe('hand');
            expect(this.player2Object.hand).toHaveLength(1);
            expect(this.harrenhal.tokens.ghost).toBe(1);
            expect(this.harrenhal.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Harrenhal and kills House Maester to cancel Arry and place a ghost token on Harrenhal'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('can be declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.player2Object.hand).toHaveLength(2);
            expect(this.houseMaester.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when it gets its third ghost token', function () {
        beforeEach(function () {
            useArry(this, 2);

            this.player1.triggerAbility(this.harrenhal);
            this.player1.clickCard(this.houseMaester);
        });

        it('is sacrificed', function () {
            expect(this.harrenhal.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Harrenhal as it has 3 or more ghost tokens'
            );
            expect(this.player2Object.hand).toHaveLength(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
