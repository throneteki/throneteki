describe('All Men Are Fools (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Raiding Khalasar', 'Catelyn Stark (Core)'],
                hand: ['All Men Are Fools (R)']
            },
            player2: { inPlay: ['Cersei Lannister (LoCR)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.raidingKhalasar);
        this.player1.triggerAbility('All Men Are Fools');
        this.player1.clickCard(this.catelynStark);
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
    });

    it('has up to 5 chosen Lady characters gain 1 power after you win a challenge by 5 or more STR', function () {
        expect(this.catelynStark.power).toBe(1);
        expect(this.cerseiLannister.power).toBe(1);
    });
});
