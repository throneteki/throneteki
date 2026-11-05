describe('Queensguard (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [
                    { card: 'Khal Drogo (Core)', kneeling: true, attachments: ['Queensguard (R2)'] }
                ],
                hand: ['Dracarys!']
            }
        });
        this.player1.clickCard(this.queensguard);
        this.player1.clickCard(this.dracarys);
    });

    it('discards a targaryen card from your hand to stand the attached character', function () {
        expect(this.dracarys.location).toBe('discard pile');
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
