describe('Stormcrows (JtO)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Stormcrows (JtO)', gold: 2 }] },
            player2: { inPlay: ['Tumblestone Knight', 'Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.stormcrows);
        this.player1.selectValue('2');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('discards X gold from itself to give X characters -1 STR until the end of the phase', function () {
        expect(this.stormcrows.gold).toBe(0);
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.khalDrogo.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
