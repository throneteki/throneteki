describe('White Cloak', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['White Cloak'] },
                    'Robert Baratheon (Core)'
                ]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.robertBaratheon);
        this.player1.triggerAbility(this.whiteCloak);
    });

    it('gives the attached character the Kingsguard trait, and kneels it to save a King or Queen character', function () {
        expect(this.tumblestoneKnight.hasTrait('Kingsguard')).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.robertBaratheon.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
