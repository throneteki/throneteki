describe('Dornish Paramour', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Dornish Paramour'] },
            player2: { inPlay: ['Littlefinger (Core)', 'Maester Aemon (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.dornishParamour);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.dornishParamour);
        this.player1.clickCard(this.littlefinger);
    });

    it('makes a character controlled by the defending player defend after it is declared as an attacker', function () {
        this.skipActionWindow();
        this.player2.clickPrompt('Done');

        expect(this.littlefinger.isDefending()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
