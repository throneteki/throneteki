describe('Arry', function () {
    describe('when you marshal Arya Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'thenightswatch',
                    gold: 3,
                    hand: ['Arya Stark (Core)'],
                    inPlay: ['Arry']
                }
            });

            this.player1.clickCard(this.aryaStark);
        });

        it('sacrifices Arry', function () {
            expect(this.arry.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Arry as they control Arya Stark'
            );

            this.player1.clickPrompt('Pass');

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent controls Arya Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'thenightswatch',
                    gold: 4,
                    hand: ['Arry']
                },
                player2: {
                    inPlay: ['Arya Stark (Core)']
                }
            });

            this.player1.clickCard(this.arry);
        });

        it('stays in play', function () {
            expect(this.arry.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when its action is used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'thenightswatch',
                    inPlay: ['Arry']
                }
            });

            this.player1.clickMenu(this.arry, 'Draw 1 card');
        });

        it('returns Arry to your hand to draw 1 card', function () {
            expect(this.arry.location).toBe('hand');
            expect(this.player1Object.hand).toHaveLength(2);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 returns Arry to their hand to draw 1 card'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
