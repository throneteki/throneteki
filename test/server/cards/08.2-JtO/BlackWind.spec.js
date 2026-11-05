describe('Black Wind', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Black Wind', 'Asha Greyjoy (Core)', "Black Wind's Crew"],
                drawDeck: ['Hot Pie (FFH)']
            },
            player2: { drawDeck: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        this.player1.triggerAbility(this.blackWind);
    });

    it('gives Asha Greyjoy renown while you control her, and draws 1 card after a character you control discards a location or attachment using pillage', function () {
        expect(this.ashaGreyjoy.hasKeyword('renown')).toBe(true);
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
