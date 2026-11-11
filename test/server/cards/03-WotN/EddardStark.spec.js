describe('Eddard Stark (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Eddard Stark (WotN)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.eddardStark);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.eddardStark);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives another participating character you control 1 power after he gains power from renown', function () {
        expect(this.eddardStark.power).toBe(1);
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
