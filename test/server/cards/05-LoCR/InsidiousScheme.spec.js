describe('Insidious Scheme', function () {
    function setup(opponentHand) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tywin Lannister (Core)'],
                hand: ['Insidious Scheme'],
                drawDeck: Array(4).fill('Hedge Knight')
            },
            player2: { hand: opponentHand }
        });
        this.handSize = this.player1Object.hand.length;
        this.unopposedChallenge(this.player1, 'Intrigue', this.tywinLannister);
        this.player1.triggerAbility('Insidious Scheme');
    }

    it('draws 2 cards after you win an intrigue challenge by 5 or more STR', function () {
        setup.call(this, ['Castle Guard', 'Ranging Party']);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 4 cards instead if the losing opponent has no cards in hand', function () {
        setup.call(this, []);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 4);
        expect(this.player1).isReadyToTakeAction();
    });
});
