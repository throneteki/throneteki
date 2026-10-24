describe('Vanquish the Unbelievers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Vanquish the Unbelievers',
                inPlay: ['Tumblestone Knight', 'Hot Pie (FFH)']
            }
        });
        this.completeMarshalPhase();
        this.player1.nameTrait('Knight');
    });

    it('kills each character you control without the named trait after the challenges phase begins', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.hotPie.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
