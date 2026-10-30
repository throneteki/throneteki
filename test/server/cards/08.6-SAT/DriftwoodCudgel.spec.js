describe('Driftwood Cudgel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [
                    { card: 'Priest of Old Wyk', attachments: ['Driftwood Cudgel'] },
                    'Old Grey Gull'
                ],
                deadPile: ['Castle Guard', 'Winterfell Steward']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
    });

    it('gives the attached character +1 STR for each character in your dead pile', function () {
        expect(this.priestOfOldWyk.getStrength()).toBe(
            this.priestOfOldWyk.getPrintedStrength() + 2
        );
    });

    it('moves to another eligible character when the attached character is killed, which gains 1 power', function () {
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.priestOfOldWyk);
        this.player1.triggerAbility('Driftwood Cudgel');
        this.player1.clickCard(this.oldGreyGull);
        expect(this.priestOfOldWyk.location).toBe('dead pile');
        expect(this.driftwoodCudgel.parent).toBe(this.oldGreyGull);
        expect(this.oldGreyGull.power).toBe(1);
    });
});
