describe('Timett Son of Timett', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Timett Son of Timett', 'Burned Men'] },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.timettSonOfTimett);
        this.player1.triggerAbility(this.timettSonOfTimett);
        this.player1.clickCard(this.hotPie);
    });

    it('kills a character with printed cost up to the number of Clansman characters you control after you win a challenge he attacks in', function () {
        expect(this.hotPie.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
