describe("Mother's Men", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Crown of Gold (TRtW)'],
                discard: ["Mother's Men"]
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.crownOfGold);
        this.player1.clickCard(this.bastardInHiding);
        this.player1.triggerAbility(this.mothersMen);
    });

    it("puts itself into play from your discard pile after an opponent's character is killed by a card effect", function () {
        expect(this.mothersMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
