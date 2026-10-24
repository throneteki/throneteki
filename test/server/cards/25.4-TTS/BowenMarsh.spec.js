describe('Bowen Marsh', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], shadows: ['Bowen Marsh (TTS)'], gold: 4 }
        });
        this.player1.clickCard(this.bowenMarsh);
        this.player1.triggerAbility('Bowen Marsh');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Military');
        this.player1.clickPrompt('Military');
    });

    it('makes a character unable to be declared as an attacker in the chosen challenge type this phase', function () {
        expect(this.player1).not.toAllowSelect(this.hedgeKnight);
    });
});
