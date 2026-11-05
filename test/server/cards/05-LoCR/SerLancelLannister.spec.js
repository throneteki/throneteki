describe('Ser Lancel Lannister (LoCR)', function () {
    function setup(context, ownCards, opponentCards = []) {
        context.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['Ser Lancel Lannister (LoCR)', ...ownCards] },
            player2: { faction: 'lannister', inPlay: opponentCards }
        });
    }

    it('gets +X STR while you control exactly 1 other [lannister] Lord or Lady, where X is its STR', function () {
        setup(this, ['Ser Harys Swyft (FH)', 'Lannisport Moneylender']);

        expect(this.serLancelLannister.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gets no STR while you control 2 other [lannister] Lords or Ladies', function () {
        setup(this, ['Ser Harys Swyft (FH)', 'Tommen Baratheon (LoCR)']);

        expect(this.serLancelLannister.getStrength()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it("does not count an opponent's Lord or Lady", function () {
        setup(this, [], ['Ser Harys Swyft (FH)']);

        expect(this.serLancelLannister.getStrength()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
