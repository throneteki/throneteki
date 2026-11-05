describe('isReadyToTakeAction', function () {
    describe('in the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Winterfell Steward'] },
                player2: { inPlay: ['Lannisport Merchant'] }
            });
        });

        it('accepts the prompt to initiate a challenge between challenges', function () {
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).not.isReadyToTakeAction();
        });

        it('accepts the action window during a challenge', function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.winterfellSteward);
            this.player1.clickPrompt('Done');

            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).not.isReadyToTakeAction();
        });

        it('rejects the defender prompt during a challenge', function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.winterfellSteward);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');

            expect(this.player2).toHavePrompt('Select defenders');
            expect(this.player2).not.isReadyToTakeAction();
            expect(this.player1).not.isReadyToTakeAction();
        });
    });
});
