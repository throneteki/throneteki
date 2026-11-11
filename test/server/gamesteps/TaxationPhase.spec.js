describe('the taxation phase', function () {
    describe('when both players have unspent gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.returned = [];
            this.game.on('onGoldReturned', (event) => this.returned.push(event));

            this.completeChallengesPhase();
        });

        it('returns each unspent gold pool', function () {
            expect(this.player1.player.gold).toBe(0);
            expect(this.player2.player.gold).toBe(0);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 returns 5 unspent gold to the treasury'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'player2 returns 5 unspent gold to the treasury'
            );
        });

        it('returns them simultaneously, as one event', function () {
            expect(this.returned.map((event) => event.player.name).sort()).toEqual([
                'player1',
                'player2'
            ]);
            expect(this.returned.every((event) => event.amount === 5)).toBe(true);
            expect(new Set(this.returned.map((event) => event.parent)).size).toBe(1);
        });
    });

    describe('when a player does not return unspent gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    plot: 'The Long Plan',
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.returned = [];
            this.game.on('onGoldReturned', (event) => this.returned.push(event));

            this.completeChallengesPhase();
        });

        it('leaves that gold in their pool and returns the other pool', function () {
            expect(this.player1.player.gold).toBe(0);
            expect(this.player2.player.gold).toBeGreaterThan(0);
            expect(this.returned.map((event) => event.player)).toEqual([this.player1.player]);
        });
    });
});
