describe('Nighttime Marauders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['Nighttime Marauders (R)'], gold: 5 },
            player2: {
                discard: ['Hedge Knight'],
                hand: ['Tumblestone Knight', 'Winterfell Steward']
            }
        });
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.triggerAbility('Nighttime Marauders');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("discards each card in the opponent's hand with the same printed cost as the chosen card", function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
