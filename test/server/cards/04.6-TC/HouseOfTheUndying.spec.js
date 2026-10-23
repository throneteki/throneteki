describe('House of the Undying', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', inPlay: ['House of the Undying'] },
            player2: {
                deadPile: [
                    'Hedge Knight',
                    'Winterfell Steward',
                    'Robb Stark (Core)',
                    'Robb Stark (Core)'
                ]
            }
        });
        this.player1.clickCard(this.houseOfTheUndying);
    });

    it("removes itself from the game to put each character in an opponent's dead pile into play under your control", function () {
        expect(this.houseOfTheUndying.location).toBe('out of game');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.hedgeKnight.controller).toBe(this.player1Object);
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.winterfellSteward.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });

    it('leaves a unique character in the dead pile when there is more than one copy of it', function () {
        for (const robb of this.player2Object.deadPile) {
            expect(robb.name).toBe('Robb Stark');
        }
        expect(this.player2Object.deadPile).toHaveLength(2);
    });

    it("returns each of them to its owner's dead pile at the end of the phase", function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('dead pile');
        expect(this.player2Object.deadPile).toHaveLength(4);
    });
});
