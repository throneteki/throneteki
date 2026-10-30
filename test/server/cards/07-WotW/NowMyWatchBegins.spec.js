describe('Now My Watch Begins', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                hand: ['Dissension', 'Now My Watch Begins'],
                gold: 4
            },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.dissension);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.triggerAbility(this.nowMyWatchBegins);
    });

    it("puts a character with printed cost 5 or lower into play under your control after it is placed in an opponent's discard pile", function () {
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.winterfellSteward.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
