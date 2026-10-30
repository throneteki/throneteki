describe('Ser Gulian Qorgyle (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Gulian Qorgyle (MaV)'] },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('Ser Gulian Qorgyle');
        this.player1.clickPrompt('Power');
    });

    it("has an opponent's character declared as an attacker lose an icon of your choice until the end of the phase", function () {
        expect(this.courtesanOfTheRose.hasIcon('power')).toBe(false);
        expect(this.courtesanOfTheRose.hasIcon('intrigue')).toBe(true);
    });
});
