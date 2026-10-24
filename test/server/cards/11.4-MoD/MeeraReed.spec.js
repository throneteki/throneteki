describe('Meera Reed (MoD)', function () {
    describe('after she comes out of shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { shadows: ['Meera Reed (MoD)'], gold: 1 },
                player2: { inPlay: ['Winterfell Steward'] }
            });
            this.player1.clickCard(this.meeraReed);
            this.player1.triggerAbility(this.meeraReed);
            this.player1.clickCard(this.winterfellSteward);
        });

        it('treats the text box of a character as blank until the end of the phase', function () {
            expect(this.winterfellSteward.isBlankExcludingTraits()).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after a stark character you control is sacrificed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Fallen from Favor'],
                    inPlay: ['Meera Reed (MoD)', 'Winterfell Steward']
                }
            });
            this.player1.selectPlot('Fallen from Favor');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.winterfellSteward);
            this.player1.triggerAbility(this.meeraReed);
        });

        it('returns her to shadows', function () {
            expect(this.meeraReed.location).toBe('shadows');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
