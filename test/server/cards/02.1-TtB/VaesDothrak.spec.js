describe('Vaes Dothrak', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'targaryen', inPlay: ['Vaes Dothrak'], hand: ['Seal of the Hand'] },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', attachments: ['Milk of the Poppy'] }] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.vaesDothrak);
        this.player1.clickCard(this.sealOfTheHand);
        this.player1.clickCard(this.milkOfThePoppy);
    });

    it('discards an attachment from your hand to discard an attachment with equal or lower printed cost from play after you reveal a plot', function () {
        expect(this.sealOfTheHand.location).toBe('discard pile');
        expect(this.milkOfThePoppy.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
