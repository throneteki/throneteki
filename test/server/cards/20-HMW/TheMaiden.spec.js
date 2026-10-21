describe('The Maiden', function () {
    it('does nothing while it is your revealed plot', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'The Maiden (HMW)' }
        });

        expect(this.player1Object.getInitiative()).toBe(1);
        expect(this.player1Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('while it is in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plot: 'The Maiden (HMW)',
                    plotDeck: ['The Crone (HMW)', 'Filler Plot']
                }
            });

            this.player1.selectPlot('The Maiden (HMW)');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.completeChallengesPhase();
        });

        it('raises the initiative on your revealed plot by 2', function () {
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');

            expect(this.player1Object.getInitiative()).toBe(2);
            expect(this.player1Object.getReserve()).toBe(6);
            expect(this.player2Object.getInitiative()).toBe(0);
        });

        it('also raises the reserve on your revealed The Seven plot by 2', function () {
            this.player1.selectPlot('The Crone (HMW)');
            this.player2.selectPlot('Filler Plot');

            expect(this.player1Object.getInitiative()).toBe(2);
            expect(this.player1Object.getReserve()).toBe(6);
        });
    });
});
