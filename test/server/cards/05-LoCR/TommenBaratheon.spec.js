describe('Tommen Baratheon (LoCR)', function () {
    function setup(context, hand) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tommen Baratheon (LoCR)', 'Tumblestone Knight'],
                hand
            }
        });

        context.unopposedChallenge(context.player1, 'Power', context.tumblestoneKnight);
    }

    it('stops a player with no cards in hand gaining power from challenge bonuses', function () {
        setup(this, []);

        expect(this.player1Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not affect a player with cards in hand', function () {
        setup(this, ['House Maester']);

        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
