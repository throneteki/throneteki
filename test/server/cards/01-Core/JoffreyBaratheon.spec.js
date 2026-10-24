describe('Joffrey Baratheon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Joffrey Baratheon (Core)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.serJaimeLannister);
        this.player1.triggerAbility(this.joffreyBaratheon);
    });

    it('gains 1 power after a Lord or Lady character is killed', function () {
        expect(this.serJaimeLannister.location).toBe('dead pile');
        expect(this.joffreyBaratheon.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
