describe('Lightbringer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: [{ card: 'Stannis Baratheon (TIMC)', attachments: ['Lightbringer'] }]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.stannisBaratheon);
        this.player1.triggerAbility(this.lightbringer);
    });

    it('gives Stannis Baratheon renown, and stands the attached character after it gains power', function () {
        expect(this.stannisBaratheon.hasKeyword('renown')).toBe(true);
        expect(this.stannisBaratheon.power).toBe(1);
        expect(this.stannisBaratheon.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
