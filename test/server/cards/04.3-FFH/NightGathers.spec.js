describe('Night Gathers...', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                plot: 'A Noble Cause',
                hand: ['Night Gathers...', 'Steward at the Wall']
            },
            player2: {
                faction: 'lannister',
                plot: 'Sneak Attack',
                discard: ['Tyrion Lannister (Core)', 'Gold Cloaks']
            }
        });
        this.player1.clickCard(this.nightGathers);
    });

    it('still allows marshaling your own cards from hand', function () {
        this.player1.clickCard(this.stewardAtTheWall);
        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player1Object.gold).toBe(3);
    });

    it("allows marshaling characters from the opponent's discard pile", function () {
        this.player1.clickCard(this.goldCloaks);
        expect(this.goldCloaks.location).toBe('play area');
        expect(this.goldCloaks.controller).toBe(this.player1Object);
        expect(this.player2Object.discardPile).not.toContain(this.goldCloaks);
        expect(this.player1Object.gold).toBe(0);
    });

    it("applies reducers to cards from the opponent's discard pile", function () {
        this.player1.clickCard(this.tyrionLannister);
        expect(this.tyrionLannister.location).toBe('play area');
        expect(this.tyrionLannister.controller).toBe(this.player1Object);
        expect(this.player1Object.gold).toBe(1);
    });
});
