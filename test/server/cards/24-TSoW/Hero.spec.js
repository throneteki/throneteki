describe('Hero', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hero', 'Free Brothers (ATT)'] },
            player2: { hand: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', [this.hero, this.freeBrothers]);
        this.player1.triggerAbility(this.hero);
    });

    it('stands an Army character after a challenge he wins if you have fewer cards in hand than the losing opponent', function () {
        this.player1.clickCard(this.freeBrothers);

        expect(this.freeBrothers.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
