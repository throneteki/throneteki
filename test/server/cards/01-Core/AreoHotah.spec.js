describe('Areo Hotah (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Areo Hotah (Core)'], gold: 5 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.areoHotah);
        this.player1.triggerAbility(this.areoHotah);
        this.player1.clickCard(this.khalDrogo);
    });

    it('removes a participating character from the challenge after he enters play during a challenge', function () {
        expect(this.areoHotah.location).toBe('play area');
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
