describe('He Calls It Thinking', function () {
    function setup(gold) {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['He Calls It Thinking'] },
            player2: { inPlay: ['Highborn Recruit (ChoS)', 'Hedge Knight'], gold }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickMenu(this.highbornRecruit, 'Give character keyword');
        this.player2.clickCard(this.hedgeKnight);
        this.player1.triggerAbility('He Calls It Thinking');
    }

    it("cancels an opponent's triggered ability unless they pay 1 gold", function () {
        setup.call(this, 1);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(false);
    });

    it('does not cancel it if they pay 1 gold', function () {
        setup.call(this, 1);
        this.player2.clickPrompt('Yes');
        this.player2.clickPrompt('Insight');
        expect(this.player2Object.gold).toBe(0);
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(true);
    });

    it('cancels it when they cannot pay', function () {
        setup.call(this, 0);
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(false);
    });
});
