describe('Tyrion Lannister (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tyrion Lannister (Core)', 'Lordsport Shipwright'], gold: 0 }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.lordsportShipwright);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.tyrionLannister);
    });

    it('gains 2 gold after an intrigue challenge is initiated', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
