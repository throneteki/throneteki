describe('Venomous Blade', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Venomous Blade'], inPlay: ['Edric Dayne (Core)'], gold: 3 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.venomousBlade);
        this.player1.clickCard(this.edricDayne);
        this.player1.triggerAbility(this.venomousBlade);
    });

    it('gives the attached character +1 STR and poisons a character with printed STR 2 or lower after it enters play', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.edricDayne.getStrength()).toBe(2);

        this.completeMarshalPhase();

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
