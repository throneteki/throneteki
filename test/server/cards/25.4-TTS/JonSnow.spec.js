describe('Jon Snow (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Jon Snow (TTS)', 'House Maester']
            },
            player2: {
                hand: ['Hedge Knight'],
                inPlay: ['Tumblestone Knight', { card: 'Bastard in Hiding', kneeling: true }]
            }
        });
    });

    describe('when military claim is applied', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.jonSnow);
        });

        it('can force kneeling characters to be chosen', function () {
            this.player1.triggerAbility(this.jonSnow);
            this.player1.clickPrompt('Kneeling Characters');

            expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
            expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
            this.player2.clickCard(this.bastardInHiding);

            expect(this.bastardInHiding.location).toBe('dead pile');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can force standing characters to be chosen', function () {
            this.player1.triggerAbility(this.jonSnow);
            this.player1.clickPrompt('Standing Characters');

            expect(this.player2).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player2).not.toBeAbleToSelect(this.bastardInHiding);
            this.player2.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.bastardInHiding.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when claim is applied for a challenge that is not military', function () {
        beforeEach(function () {
            this.handSizeBeforeClaim = this.player2Object.hand.length;
            this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        });

        it('does not trigger', function () {
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
