describe('Someone Always Tells (SAT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['Tumblestone Knight'],
                hand: ['Someone Always Tells (SAT)'],
                gold: 2
            },
            player2: { plotDeck: ['Trading with the Pentoshi', 'Valar Morghulis'] }
        });
        this.player1.selectPlot('Filler Plot');
    });

    it('is not offered against a when revealed ability that cannot be canceled', function () {
        this.player2.selectPlot('Trading with the Pentoshi');
        this.selectFirstPlayer(this.player2);

        expect(this.player1).not.toAllowAbilityTrigger(this.someoneAlwaysTells);
        expect(this.player2).isReadyToTakeAction();
    });

    it("cancels an opponent's when revealed ability", function () {
        this.player2.selectPlot('Valar Morghulis');
        this.selectFirstPlayer(this.player2);

        expect(this.player1).toAllowAbilityTrigger(this.someoneAlwaysTells);
        this.player1.triggerAbility(this.someoneAlwaysTells);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
