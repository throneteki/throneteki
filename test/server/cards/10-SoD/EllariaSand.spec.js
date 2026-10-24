describe('Ellaria Sand (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Ellaria Sand (SoD)'] },
            player2: { inPlay: ['Littlefinger (Core)', 'Maester Aemon (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.ellariaSand);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.ellariaSand);
        this.player1.clickCard(this.littlefinger);
        this.player1.clickCard(this.maesterAemon);
        this.player1.clickPrompt('Done');
    });

    it('makes up to 3 characters controlled by the defending player defend after she is declared as an attacker', function () {
        this.skipActionWindow();
        this.player2.clickPrompt('Done');

        expect(this.littlefinger.isDefending()).toBe(true);
        expect(this.maesterAemon.isDefending()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
