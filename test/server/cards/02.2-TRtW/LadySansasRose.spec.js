describe("Lady Sansa's Rose", function () {
    it('has a Knight attacking alone gain 1 power', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ["Lady Sansa's Rose"] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility("Lady Sansa's Rose");
        expect(this.hedgeKnight.power).toBe(1);
    });

    it('has it gain 3 power instead if you control a Lady character', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Hedge Knight', 'Catelyn Stark (Core)'],
                hand: ["Lady Sansa's Rose"]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility("Lady Sansa's Rose");
        expect(this.hedgeKnight.power).toBe(3);
    });
});
