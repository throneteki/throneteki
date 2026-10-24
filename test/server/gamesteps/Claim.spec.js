describe('claim', function () {
    describe('when manual mode is off', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight', 'House Maester']
                },
                player2: {
                    hand: ['Nightmares'],
                    inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
                }
            });
        });

        it('applies military claim without asking the winner', function () {
            this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);

            expect(this.player2).toHavePrompt('Select 1 character to fulfill military claim');
            this.player2.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Select 1 character to fulfill military claim');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.bastardInHiding.location).toBe('play area');

            this.player2.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.bastardInHiding.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('applies intrigue claim without asking the winner', function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);

            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('military claim', function () {
        function militaryChallenge(context, defenders, plot = 'Filler Plot') {
            context.setupTest({
                phase: 'challenge',
                player1: {
                    plot,
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    inPlay: defenders
                }
            });

            context.unopposedChallenge(context.player1, 'Military', context.hedgeKnight);
        }

        it('does not prompt a loser who controls no characters', function () {
            militaryChallenge(this, []);

            expect(this.player2).not.toHavePrompt('Select 1 character to fulfill military claim');
            expect(this.game.getPlainTextLog()).toContain(
                'player2 has no characters to fulfill military claim'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not prompt a loser whose only characters cannot be killed', function () {
            militaryChallenge(this, ['Balerion (FH)']);

            expect(this.balerion.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('kills as many characters as the claim value', function () {
            militaryChallenge(
                this,
                ['Tumblestone Knight', 'Bastard in Hiding', 'House Maester'],
                'The Winds of Winter'
            );

            expect(this.player2).toHavePrompt('Select 2 characters to fulfill military claim');

            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.location).toBe('play area');

            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');

            expect(this.player2).toHavePrompt(
                'Select order to place cards in your dead pile (top first)'
            );
            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.bastardInHiding.location).toBe('dead pile');
            expect(this.houseMaester.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('kills every character the loser can when they have fewer than the claim value', function () {
            militaryChallenge(this, ['Tumblestone Knight', 'Balerion (FH)'], 'The Winds of Winter');

            expect(this.player2).toHavePrompt('Select 2 characters to fulfill military claim');
            expect(this.player2).not.toBeAbleToSelect(this.balerion);

            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.location).toBe('play area');

            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.balerion.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('military claim with characters that must be chosen', function () {
        function crossbowChallenge(context, defenders, plot = 'Filler Plot') {
            context.setupTest({
                phase: 'challenge',
                player1: {
                    plot,
                    inPlay: [{ card: 'Hedge Knight', attachments: ["Joffrey's Crossbow"] }]
                },
                player2: {
                    inPlay: defenders
                }
            });

            context.unopposedChallenge(context.player1, 'Military', context.hedgeKnight);
        }

        it('only lets the loser choose those characters', function () {
            crossbowChallenge(this, ['Grand Maester Pycelle (Core)', 'House Maester']);

            expect(this.player2).toBeAbleToSelect(this.grandMaesterPycelle);
            expect(this.player2).not.toBeAbleToSelect(this.houseMaester);

            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.grandMaesterPycelle.location).toBe('dead pile');
            expect(this.houseMaester.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('chooses them automatically when there are fewer than the claim value', function () {
            crossbowChallenge(
                this,
                ['Grand Maester Pycelle (Core)', 'House Maester', 'Tumblestone Knight'],
                'The Winds of Winter'
            );

            expect(this.game.getPlainTextLog()).toContain(
                'Grand Maester Pycelle is automatically chosen for claim'
            );
            expect(this.player2).toHavePrompt('Select 1 character to fulfill military claim');
            expect(this.player2).not.toBeAbleToSelect(this.grandMaesterPycelle);

            this.player2.clickCard(this.houseMaester);
            this.player2.clickPrompt('Done');

            expect(this.grandMaesterPycelle.location).toBe('dead pile');
            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('kills them without a prompt when the loser has no other characters to choose', function () {
            crossbowChallenge(
                this,
                ['Grand Maester Pycelle (Core)', 'Balerion (FH)'],
                'The Winds of Winter'
            );

            expect(this.grandMaesterPycelle.location).toBe('dead pile');
            expect(this.balerion.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not apply to characters that cannot be killed', function () {
            crossbowChallenge(this, ['Balerion (FH)', 'House Maester']);

            this.player2.clickCard(this.houseMaester);

            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.balerion.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when manual mode is on', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                gameOptions: { manualMode: true },
                player1: {
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        });

        it('lets the winner skip claim', function () {
            expect(this.player1).toHavePrompt('Perform before claim actions');
            this.player1.clickPrompt('Continue');

            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('still applies claim when the winner chooses to', function () {
            this.player1.clickPrompt('Apply Claim');
            this.player2.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
