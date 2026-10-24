describe('Ghost Hill Elite (WoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['Ghost Hill Elite (WoW)'], gold: 6 },
            player2: { inPlay: ['Lordsport Shipwright'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ghostHillElite);
        this.player1.triggerAbility(this.ghostHillElite);
        this.player1.clickCard(this.lordsportShipwright);
        this.player1.clickPrompt('Intrigue');
    });

    it('takes an intrigue or power icon from a character after it enters play, then kills that character if it has no icons left', function () {
        expect(this.ghostHillElite.hasIcon('intrigue')).toBe(true);
        expect(this.lordsportShipwright.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
