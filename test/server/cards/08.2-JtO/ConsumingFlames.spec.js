describe('Consuming Flames', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Consuming Flames', 'Dracarys!'],
                inPlay: ['Khal Drogo (Core)'],
                gold: 2
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.consumingFlames);
        this.player1.clickCard(this.dracarys);
        this.player1.clickCard(this.khalDrogo);
    });

    it('discards another targaryen card to give a participating character -3 STR and kill it if its STR is 0', function () {
        expect(this.dracarys.location).toBe('discard pile');
        expect(this.khalDrogo.getStrength()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
