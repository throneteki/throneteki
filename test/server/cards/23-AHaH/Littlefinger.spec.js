describe('Littlefinger (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Littlefinger (AHaH)'], hand: ['Hedge Knight'] },
            player2: { hand: ['The Roseroad'], power: 3 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.littlefinger);
        this.player1.triggerAbility('Littlefinger');
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theRoseroad);
    });

    it('moves 1 power from a card in play to itself if no opponent revealed a card of the same type', function () {
        this.player1.clickCard(this.player2Object.faction);
        expect(this.littlefinger.power).toBe(1);
    });
});
