describe('Dornish Sloop (LotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Dornish Sloop (LotW)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.dornishSloop);
        this.player1.triggerAbility(this.dornishSloop);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Military');
    });

    it('makes a character with printed cost 5 or lower lose a challenge icon of your choice after it comes out of shadows', function () {
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
