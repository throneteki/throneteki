describe('He Calls It Thinking', function () {
    function setup(test, gold) {
        test.setupTest({
            phase: 'challenge',
            player1: { hand: ['He Calls It Thinking'] },
            player2: { inPlay: ['Highborn Recruit (ChoS)', 'Hedge Knight'], gold }
        });
        test.player1.clickPrompt('Done');
        test.player2.clickMenu(test.highbornRecruit, 'Give character keyword');
        test.player2.clickCard(test.hedgeKnight);
        test.player1.triggerAbility('He Calls It Thinking');
    }

    it("cancels an opponent's triggered ability unless they pay 1 gold", function () {
        setup(this, 1);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(false);
    });

    it('does not cancel it if they pay 1 gold', function () {
        setup(this, 1);
        this.player2.clickPrompt('Yes');
        this.player2.clickPrompt('Insight');
        expect(this.player2Object.gold).toBe(0);
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(true);
    });

    it('cancels it when they cannot pay', function () {
        setup(this, 0);
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(false);
    });
});
