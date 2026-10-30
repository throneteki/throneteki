describe("Iron Victory's Crew", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["Iron Victory's Crew"],
                drawDeck: ['Tumblestone Knight', 'Refurbished Hulk']
            }
        });

        this.player1.clickCard(this.ironVictorysCrew);
        this.player1.triggerAbility(this.ironVictorysCrew);
    });

    it('searches your deck for a Warship location after it enters play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.refurbishedHulk);

        expect(this.refurbishedHulk.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
