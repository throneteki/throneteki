describe('The Pack Survives', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Winterfell Steward', 'Bear Island Loyalist'],
                hand: ['The Pack Survives'],
                discard: ['The Roseroad']
            },
            player2: { hand: ['Plunder'] }
        });
        this.player1.clickPrompt('Done');
        this.startingGold = this.player2Object.gold;
        this.player2.clickCard(this.plunder);
        this.player1.triggerAbility('The Pack Survives');
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickCard(this.bearIslandLoyalist);
        this.player1.clickPrompt('Done');
    });

    it("kneels 2 stark characters to cancel an opponent's event", function () {
        expect(this.winterfellSteward.kneeled).toBe(true);
        expect(this.bearIslandLoyalist.kneeled).toBe(true);
        expect(this.player2Object.gold).toBe(this.startingGold);
        expect(this.plunder.location).toBe('discard pile');
    });
});
