describe('Wildling Bandit', function () {
    function setup(context, opponentGold) {
        context.setupTest({
            phase: 'challenge',
            player1: { gold: 1, inPlay: ['Wildling Bandit'] },
            player2: { gold: opponentGold }
        });
    }

    it('gets no STR while not attacking', function () {
        setup(this, 3);

        expect(this.wildlingBandit.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gets +2 STR while attacking an opponent with more gold than you', function () {
        setup(this, 2);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.wildlingBandit);
        this.player1.clickPrompt('Done');

        expect(this.wildlingBandit.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gets no STR while attacking an opponent with the same gold as you', function () {
        setup(this, 1);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.wildlingBandit);
        this.player1.clickPrompt('Done');

        expect(this.wildlingBandit.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
