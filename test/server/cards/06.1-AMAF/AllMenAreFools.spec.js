describe('All Men Are Fools (AMAF)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Raiding Khalasar', 'Catelyn Stark (Core)'],
                hand: ['All Men Are Fools (AMAF)']
            },
            player2: { inPlay: ['Cersei Lannister (LoCR)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.raidingKhalasar);
        this.player1.triggerAbility('All Men Are Fools');
    });

    it('has each Lady character you control gain 1 power after you win a challenge by 5 or more STR', function () {
        expect(this.catelynStark.power).toBe(1);
        expect(this.cerseiLannister.power).toBe(0);
    });
});
