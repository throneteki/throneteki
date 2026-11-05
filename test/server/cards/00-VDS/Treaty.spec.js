describe('Treaty', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Treaty', drawDeck: ['Hedge Knight'], hand: ['Castle Guard'] },
            player2: { hand: ['The Roseroad'] },
            beforeMulligan() {
                expect(this.player1).toHavePrompt('Name 2 factions');
                this.player1.clickPrompt('Stark');
                this.player1.clickPrompt('Martell');
            }
        });
    });

    it('names two factions and kneels the faction card to draw and choose a discard', function () {
        expect(this.treaty.namedFactions).toEqual(['stark', 'martell']);
        this.player1.clickMenu(this.treaty, 'Draw card then discard card');
        expect(this.player1).toBeAbleToSelect(this.castleGuard);
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        this.player1.clickCard(this.castleGuard);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1.actionUnavailableReason(this.treaty)).toBe('cost');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can discard the card just drawn instead of a card already in hand', function () {
        this.player1.clickMenu(this.treaty, 'Draw card then discard card');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
