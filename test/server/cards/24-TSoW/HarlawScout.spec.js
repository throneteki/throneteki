describe('Harlaw Scout (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Harlaw Scout (TSoW)']
            },
            player2: {
                hand: Array(8).fill('House Dayne Knight')
            }
        });

        this.completeChallengesPhase();
        this.player2.discardToReserve();
    });

    it('gains 1 gold after an opponent discards for reserve', function () {
        this.player1.triggerAbility(this.harlawScout);

        expect(this.game.getPlainTextLog()).toContain('player1 uses Harlaw Scout to gain 1 gold');
        expect(this.player1).isReadyToTakeAction();
    });
});
