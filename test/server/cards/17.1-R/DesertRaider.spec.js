describe('Desert Raider (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { deadPile: ['Desert Raider (R)'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.serJaimeLannister);
        this.player1.triggerAbility(this.desertRaider);
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Intrigue');
    });

    it('puts itself into play from your dead pile after you lose a challenge to take an intrigue or power icon from a character the winner controls', function () {
        expect(this.desertRaider.location).toBe('play area');
        expect(this.serJaimeLannister.hasIcon('intrigue')).toBe(false);
        expect(this.desertRaider.hasIcon('intrigue')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
