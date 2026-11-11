describe('Dracarys!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Dracarys!'],
                inPlay: ['Daenerys Targaryen (Core)', 'Khal Drogo (Core)'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.dracarys);
        this.player1.clickCard(this.daenerysTargaryen);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels a Dragon or Daenerys to give a participating character -4 STR and kill it if its STR is 0', function () {
        expect(this.daenerysTargaryen.kneeled).toBe(true);
        expect(this.khalDrogo.getStrength()).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
