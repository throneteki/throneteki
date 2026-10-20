describe('the marshaling action window', function () {
    describe('when action windows are not strict', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['The Kingsroad']
                },
                player2: {
                    gold: 5,
                    hand: ['Nightmares']
                }
            });
        });

        it('lets the active player marshal and refuses everyone else until the window reaches them', function () {
            expect(this.player1).toHavePrompt('Marshal your cards');
            expect(this.player2.actionUnavailableReason(this.nightmares)).toBe('window');

            this.player1.clickCard(this.theKingsroad);
            expect(this.theKingsroad.location).toBe('play area');

            this.player1.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Marshal your cards');
            expect(this.player2.actionUnavailableReason(this.nightmares)).toBeUndefined();
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);
        });
    });

    describe('when action windows are strict', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                gameOptions: { strictActionWindows: true },
                player1: {
                    inPlay: ['Hedge Knight'],
                    hand: ['The Kingsroad']
                },
                player2: {
                    gold: 5,
                    hand: ['Nightmares']
                }
            });
        });

        it('gives every player the window, in player order, before the next player marshals', function () {
            expect(this.player1).toHavePrompt('Marshal your cards');
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Initiate an action');
            expect(this.player2.actionUnavailableReason(this.nightmares)).toBeUndefined();

            this.player2.clickPrompt('Pass');
            expect(this.player2).toHavePrompt('Marshal your cards');
        });
    });
});
