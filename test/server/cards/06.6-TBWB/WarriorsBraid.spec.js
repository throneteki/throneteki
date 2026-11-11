describe("Warrior's Braid", function () {
    describe('after you win a military challenge the attached character attacks in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Aggo', attachments: ["Warrior's Braid"] }] }
            });
            expect(this.aggo.hasKeyword('renown')).toBe(true);
            this.unopposedChallenge(this.player1, 'Military', this.aggo);
            this.player1.triggerAbility(this.warriorsBraid);
        });

        it('gives it renown, and places a bell token that gives it +1 STR', function () {
            expect(this.warriorsBraid.tokens.bell).toBe(1);
            expect(this.aggo.getStrength()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
