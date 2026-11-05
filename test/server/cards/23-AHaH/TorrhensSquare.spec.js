describe("Torrhen's Square", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["Torrhen's Square"],
                shadows: ['Nighttime Marauders (R)'],
                gold: 3
            }
        });
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.triggerAbility("Torrhen's Square");
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickPrompt('Done');
    });

    it('has chosen Raider characters discard an additional card using pillage until the end of the phase', function () {
        expect(this.torrhensSquare.kneeled).toBe(true);
        expect(this.nighttimeMarauders.getKeywordTriggerModifier('pillage')).toBe(1);
    });
});
