describe('Catelyn Stark (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Catelyn Stark (WotN)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.catelynStark);
    });

    it('gains 1 power after a stark character you control is killed, and gets +1 STR for each power she has', function () {
        expect(this.catelynStark.power).toBe(1);
        expect(this.catelynStark.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
