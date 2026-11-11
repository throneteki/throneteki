describe('The Blackfish (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'The Blackfish (WotN)', power: 4 }]
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.theBlackfish);
    });

    it('stops House Tully characters kneeling as attackers while he has 4 power, and draws 1 card after you win a [military] challenge as the attacker', function () {
        expect(this.theBlackfish.kneeled).toBe(false);

        this.player1.triggerAbility(this.theBlackfish);

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
