describe('Shadow Politics', function () {
    it('discards a card from shadows', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Shadow Politics'], gold: 1 },
            player2: { shadows: ['Nighttime Marauders (R)'] }
        });
        this.player1.clickCard(this.shadowPolitics);
        this.player1.clickCard(this.nighttimeMarauders);
        expect(this.nighttimeMarauders.location).toBe('discard pile');
    });

    it('removes up to 5 cards in a discard pile from the game', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Shadow Politics'], gold: 1 },
            player2: { discard: ['Hedge Knight', 'Castle Guard'] }
        });
        this.player1.clickCard(this.shadowPolitics);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.castleGuard.location).toBe('out of game');
    });

    it("looks at an opponent's hand", function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Shadow Politics'], gold: 1 },
            player2: { hand: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.shadowPolitics);
        expect(this.player1).toHavePrompt("Look at player2's hand");
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});
