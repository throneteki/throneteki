describe('the standing phase', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }, 'Bastard in Hiding'],
                factionKneeling: true
            },
            player2: {
                inPlay: [{ card: 'House Dayne Knight', kneeling: true }],
                factionKneeling: true
            }
        });

        this.stood = [];
        this.game.on('onCardStood', (event) => this.stood.push(event));

        this.completeChallengesPhase();
    });

    it("stands every player's kneeling cards, including faction cards", function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.houseDayneKnight.kneeled).toBe(false);
        expect(this.player1.player.faction.kneeled).toBe(false);
        expect(this.player2.player.faction.kneeled).toBe(false);
    });

    it('stands them all simultaneously, as one event', function () {
        expect(this.stood.map((event) => event.card)).toEqual(
            expect.arrayContaining([
                this.tumblestoneKnight,
                this.houseDayneKnight,
                this.player1.player.faction,
                this.player2.player.faction
            ])
        );
        expect(this.stood).toHaveLength(4);
        expect(new Set(this.stood.map((event) => event.parent)).size).toBe(1);
    });

    it('does not stand cards that were already standing', function () {
        expect(this.stood.map((event) => event.card)).not.toContain(this.bastardInHiding);
    });
});
