describe('Unexpected Delay', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Unexpected Delay',
                inPlay: [{ card: 'Robb Stark (Core)', dupes: 1 }, 'Hedge Knight']
            },
            player2: { inPlay: ['Castle Guard', { card: 'Winterfell Steward', power: 1 }] }
        });
        [this.dupe] = this.robbStark.dupes;
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    it('does not let a character with power be chosen', function () {
        expect(this.player2).not.toAllowSelect(this.winterfellSteward);
    });

    it("returns each chosen character to its owner's hand", function () {
        this.player1.clickCard(this.castleGuard);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('only returns a character chosen by both players once', function () {
        this.player1.clickCard(this.robbStark);
        this.player2.clickCard(this.robbStark);
        expect(this.robbStark.location).toBe('play area');
        expect(this.dupe.location).toBe('discard pile');
    });
});
