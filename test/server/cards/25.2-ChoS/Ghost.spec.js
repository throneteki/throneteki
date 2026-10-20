describe('Ghost (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ghost (ChoS)', 'Jon Snow (MoD)', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });
    });

    describe('when you win a challenge with an attacking Direwolf', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.ghost);
        });

        it('draws 1 card', function () {
            this.player1.triggerAbility(this.ghost);

            expect(this.player1Object.hand).toHaveLength(1);
            expect(this.game.getPlainTextLog()).toContain('player1 uses Ghost to draw 1 card');

            this.player2.clickCard(this.bastardInHiding);

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you win a challenge without an attacking Direwolf', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.ghost);

            this.player2.clickCard(this.bastardInHiding);

            expect(this.player1Object.hand).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you win a challenge with a defending Direwolf', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.ghost);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('cannot be triggered', function () {
            expect(this.game.getPlainTextLog()).toContain('player1 won a military challenge');
            expect(this.player1).not.toAllowAbilityTrigger(this.ghost);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when a character you control would be killed', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('sacrifices Ghost to save Jon Snow', function () {
            this.player1.clickCard(this.jonSnow);
            this.player1.triggerAbility(this.ghost);

            expect(this.ghost.location).toBe('discard pile');
            expect(this.jonSnow.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Ghost to save Jon Snow'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot save another character', function () {
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.player1).not.toAllowAbilityTrigger(this.ghost);
            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.ghost.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
