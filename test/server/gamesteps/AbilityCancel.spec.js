describe('cancelling an ability', function () {
    function playRide(context, gameOptions) {
        context.setupTest({
            phase: 'challenge',
            gameOptions,
            player1: { inPlay: ['Tumblestone Knight'], hand: ['"Lord Renly\'s Ride"'] }
        });
        context.player1.clickCard(context.lordRenlysRide);
    }

    it('cannot be cancelled once it is resolving', function () {
        playRide(this);

        expect(this.player1).toHavePrompt('Select a character');
        expect(this.player1).not.toHavePromptButton('Cancel');

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.lordRenlysRide.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can be cancelled once manual mode is turned on while the prompt is open', function () {
        playRide(this);

        this.player1.sendChat('/manual');
        this.player2.clickPrompt('Allow');

        expect(this.player1).toHavePrompt('Select a character');
        expect(this.player1).toHavePromptButton('Cancel');

        this.player1.clickPrompt('Cancel');

        expect(this.game.getPlainTextLog()).toContain('cancels the resolution');
    });

    it('can still be cancelled in manual mode', function () {
        playRide(this, { manualMode: true });

        this.player1.clickPrompt('Cancel');

        expect(this.game.getPlainTextLog()).toContain('cancels the resolution');
    });

    it('does not crash when a target High Septon could redirect is cancelled in manual mode', function () {
        this.setupTest({
            phase: 'challenge',
            gameOptions: { manualMode: true },
            player1: {
                faction: 'stark',
                inPlay: ['High Septon', 'House Tully Septon', 'Winterfell Steward']
            },
            player2: { faction: 'targaryen', inPlay: ['Mirri Maz Duur'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.mirriMazDuur);
        this.player2.clickPrompt('Apply Claim');
        this.player2.triggerAbility('Mirri Maz Duur');

        expect(() => this.player2.clickPrompt('Cancel')).not.toThrow();
    });
});
