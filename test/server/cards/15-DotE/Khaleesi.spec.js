describe('Khaleesi', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Margaery Tyrell (Core)', attachments: ['Khaleesi'] }]
            },
            player2: { power: 3 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.margaeryTyrell);
        this.player1.triggerAbility('Khaleesi');
    });

    it('kneels after you win a challenge the attached character is in to stand it', function () {
        this.player1.clickPrompt('Stand attached character');
        expect(this.khaleesi.kneeled).toBe(true);
        expect(this.margaeryTyrell.kneeled).toBe(false);
    });

    it('or to raise your claim by 1 until the end of the challenge', function () {
        this.player1.clickPrompt('Raise claim');
        expect(this.player2Object.faction.power).toBe(1);
    });
});
