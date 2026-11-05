describe("Euron Crow's Eye (KotI)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ["Euron Crow's Eye (KotI)"],
                drawDeck: ['Silence (JS)']
            }
        });

        this.player1.clickCard(this.euronCrowsEye);
        this.player1.triggerAbility(this.euronCrowsEye);
    });

    it('searches your hand, deck and discard pile for Silence and puts it into play after you marshal him', function () {
        this.player1.clickCard(this.silence);

        expect(this.silence.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
