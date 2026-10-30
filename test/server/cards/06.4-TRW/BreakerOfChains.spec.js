describe('Breaker of Chains', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Khal Drogo (Core)', attachments: ['Breaker of Chains'] }],
                hand: ['Hot Pie (FFH)']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.breakerOfChains);
        this.player1.clickCard(this.hotPie);
    });

    it('puts a character with printed cost 2 or lower into play after the attached character attacks, and gives it +1 STR for each such character', function () {
        expect(this.hotPie.location).toBe('play area');
        expect(this.khalDrogo.getStrength()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
