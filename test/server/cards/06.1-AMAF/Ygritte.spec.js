describe('Ygritte', function () {
    describe('against an effect that kneels a character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: ['Ygritte', 'House Maester'] },
                player2: { plotDeck: ['Filthy Accusations'] }
            });

            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot(this.filthyAccusations);
            this.selectFirstPlayer(this.player2);
        });

        it('cannot be knelt by card effects', function () {
            expect(this.player2).not.toBeAbleToSelect(this.ygritte);
            expect(this.player2).toBeAbleToSelect(this.houseMaester);

            this.player2.clickCard(this.houseMaester);

            expect(this.houseMaester.kneeled).toBe(true);
            expect(this.ygritte.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Ygritte'] }
            });

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.ygritte);
            this.player1.clickPrompt('Done');
        });

        it('still kneels, because that is not a card effect', function () {
            expect(this.ygritte.kneeled).toBe(true);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('while you control another Wildling character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Ygritte', 'Wildling Bandit'] }
            });
        });

        it('gains stealth', function () {
            expect(this.ygritte.hasKeyword('stealth')).toBe(true);
            expect(this.wildlingBandit.hasKeyword('stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control no other Wildling character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Ygritte', 'House Maester'] },
                player2: { inPlay: ['Wildling Bandit'] }
            });
        });

        it('does not gain stealth', function () {
            expect(this.ygritte.hasKeyword('stealth')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
