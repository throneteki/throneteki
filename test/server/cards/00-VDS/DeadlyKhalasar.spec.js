describe('Deadly Khalasar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Deadly Khalasar'],
                inPlay: ['Khal Drogo (Core)'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.deadlyKhalasar);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gives an attacking targaryen character +1 STR for each Dothraki character you control and intimidate until the end of the challenge', function () {
        expect(this.khalDrogo.getStrength()).toBe(6);
        expect(this.khalDrogo.hasKeyword('intimidate')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
