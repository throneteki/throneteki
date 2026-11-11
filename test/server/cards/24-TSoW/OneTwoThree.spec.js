describe('One, Two, Three', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['One, Two, Three'], inPlay: ['Cersei Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.player1.triggerAbility(this.oneTwoThree);
    });

    it('places a participating character you control in shadows after you win an intrigue challenge', function () {
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Place in shadows');

        expect(this.cerseiLannister.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
