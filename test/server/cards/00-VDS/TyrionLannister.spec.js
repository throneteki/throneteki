describe('Tyrion Lannister (VDS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Tyrion Lannister (VDS)'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 1
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.tyrionLannister);
        this.player1.triggerAbility(this.tyrionLannister);
    });

    it('pays 1 gold to draw 1 card after you win an intrigue challenge', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
