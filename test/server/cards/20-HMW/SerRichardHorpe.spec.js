describe('Ser Richard Horpe (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Ser Richard Horpe (HMW)', power: 1 }] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        expect(this.serRichardHorpe.getStrength()).toBe(6);
        this.player1.clickCard(this.serRichardHorpe);
        this.player1.clickCard(this.serRichardHorpe);
        this.player1.clickCard(this.khalDrogo);
    });

    it('gets +1 STR for each power he has, and moves 1 power from a card you control to another card', function () {
        expect(this.serRichardHorpe.power).toBe(0);
        expect(this.khalDrogo.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
