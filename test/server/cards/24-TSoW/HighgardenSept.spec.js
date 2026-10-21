describe('Highgarden Sept', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'A Tourney for the King',
                inPlay: ['Highgarden Sept', 'Bonifer the Good (FH)'],
                hand: Array(6).fill('House Maester').concat(['Tumblestone Knight'])
            }
        });
    });

    it('stops non-The Seven characters entering play during the challenges phase while you have 7 or more cards in hand, and draws a card after a The Seven card gains power', function () {
        expect(this.player1Object.canPutIntoPlay(this.tumblestoneKnight)).toBe(false);

        this.unopposedChallenge(this.player1, 'Power', this.boniferTheGood);
        this.player1.triggerAbility(this.highgardenSept);

        expect(this.player1Object.hand).toHaveLength(9);
        expect(this.player1).isReadyToTakeAction();
    });
});
