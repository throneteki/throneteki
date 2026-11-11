describe('Blood Magic Ritual', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Bran Stark (Core)'], hand: ['Blood Magic Ritual'], gold: 5 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.branStark);
        this.player1.triggerAbility('Blood Magic Ritual');
    });

    it('saves a non-Army character that would be killed and attaches itself to it as a Condition', function () {
        expect(this.branStark.location).toBe('play area');
        expect(this.bloodMagicRitual.parent).toBe(this.branStark);
        expect(this.bloodMagicRitual.getType()).toBe('attachment');
        expect(this.bloodMagicRitual.hasTrait('Condition')).toBe(true);
        expect(this.bloodMagicRitual.isTerminal()).toBe(true);
    });

    it("treats the attached character's printed text box as blank", function () {
        expect(this.branStark.isAnyBlank()).toBe(true);
    });
});
