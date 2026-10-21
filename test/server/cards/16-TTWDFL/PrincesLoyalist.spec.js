describe("Prince's Loyalist", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ["Prince's Loyalist"]
            },
            player2: {
                hand: ['Alerie Tyrell'],
                drawDeck: ['Courtesan of the Rose']
            }
        });

        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.alerieTyrell);
        this.player2.triggerAbility(this.alerieTyrell);
    });

    it("pays 2 gold to cancel the effects of an opponent's triggered character ability", function () {
        this.player1.triggerAbility(this.princesLoyalist);

        expect(this.player1Object.gold).toBe(3);
        expect(this.courtesanOfTheRose.location).toBe('draw deck');
        expect(this.player2).isReadyToTakeAction();
    });
});
