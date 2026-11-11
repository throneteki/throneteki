describe('Stone Crows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Stone Crows', gold: 1 }] },
            player2: { inPlay: ['Tumblestone Knight', 'Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.stoneCrows);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.stoneCrows);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.hotPie);
    });

    it('discards 1 gold from itself to have the losing opponent choose and kill a defending character after you win a challenge it attacks in', function () {
        expect(this.stoneCrows.gold).toBe(0);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
