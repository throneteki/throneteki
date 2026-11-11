describe('Daenerys Targaryen (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Dracarys!'],
                inPlay: ['Daenerys Targaryen (R2)', 'Khal Drogo (Core)'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.dracarys);
        this.player1.clickCard(this.daenerysTargaryen);
        this.player1.clickCard(this.khalDrogo);
        this.player1.triggerAbility(this.daenerysTargaryen);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gives a participating character -1 STR and kills it if its STR is 0 after you play a targaryen event', function () {
        expect(this.khalDrogo.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
