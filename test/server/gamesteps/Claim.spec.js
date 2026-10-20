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
