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

    describe('closing the window (Appendix I, 3.2)', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                gameOptions: { strictActionWindows: true },
                player1: {
                    inPlay: ['Hedge Knight'],
                    hand: ['The Kingsroad', 'Winterfell Steward']
                },
                player2: {
                    gold: 5,
                    inPlay: ['House Maester'],
                    hand: ['Nightmares', 'Nightmares']
                }
            });
        });

        it('offers every other player an action after each card is marshaled', function () {
            this.player1.clickCard(this.theKingsroad);

            expect(this.player2).toHavePrompt('Initiate an action');

            this.player2.clickPrompt('Pass');

            expect(this.player1).toHavePrompt('Marshal your cards');
            this.player1.clickCard(this.winterfellSteward);

            expect(this.player2).toHavePrompt('Initiate an action');
        });

        it('gives the active player another opportunity after another player acts', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.hedgeKnight);

            expect(this.player1).toHavePrompt('Marshal your cards');
            this.player1.clickCard(this.theKingsroad);

            expect(this.theKingsroad.location).toBe('play area');
        });

        it('closes only once every player has passed in a row', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Initiate an action');

            this.player2.clickPrompt('Pass');

            expect(this.player2).toHavePrompt('Marshal your cards');
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);
        });
    });

    describe("during the second player's marshaling", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                gameOptions: { strictActionWindows: true },
                player1: {
                    gold: 1,
                    inPlay: ['Hedge Knight'],
                    hand: ['Nightmares']
                },
                player2: {
                    gold: 5,
                    hand: ['The Kingsroad']
                }
            });

            this.player1.clickPrompt('Done');
        });

        it('gives the first player the first opportunity', function () {
            expect(this.player1).toHavePrompt('Initiate an action');
            this.player1.clickPrompt('Pass');

            expect(this.player2).toHavePrompt('Marshal your cards');
        });

        it('offers the first player another opportunity after the active player marshals', function () {
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.theKingsroad);

            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
