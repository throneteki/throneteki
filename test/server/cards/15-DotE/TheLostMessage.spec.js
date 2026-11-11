describe('The Lost Message', function () {
    describe('when each player has cards in hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'The Lost Message',
                    hand: ['Hedge Knight', 'Nightmares', 'Tithe']
                },
                player2: {
                    hand: ['Quiet as a Shadow']
                }
            });
        });

        it('shuffles each hand into its deck and adds that many cards back', function () {
            this.player1.clickMenu(this.theLostMessage, 'Shuffle cards into deck');

            expect(this.player1Object.hand.length).toBe(3);
            expect(this.player2Object.hand.length).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses The Lost Message to have each player shuffle their hand into their deck'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be used again this round', function () {
            this.player1.clickMenu(this.theLostMessage, 'Shuffle cards into deck');

            expect(this.player1.actionUnavailableReason(this.theLostMessage)).toBe('limit');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a player has no cards in hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'The Lost Message'
                },
                player2: {
                    hand: ['Hedge Knight', 'Nightmares']
                }
            });
        });

        it('adds no cards for that player', function () {
            this.player1.clickMenu(this.theLostMessage, 'Shuffle cards into deck');

            expect(this.player1Object.hand).toEqual([]);
            expect(this.player2Object.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while a player cannot draw more cards', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'The Lost Message',
                    inPlay: ['The High Sparrow'],
                    hand: ['Hedge Knight', 'Nightmares', 'Tithe', 'Quiet as a Shadow']
                }
            });
        });

        it('still adds every shuffled card', function () {
            this.player1.clickMenu(this.theLostMessage, 'Shuffle cards into deck');

            expect(this.player1Object.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
