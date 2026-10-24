describe('Queenscrown', function () {
    function setup(drawDeck) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Queenscrown'] },
            player2: { drawDeck }
        });
        this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
    }

    it("kneels to reveal the top 3 cards of an opponent's deck", function () {
        setup.call(this, ['Fickle Bannerman', 'The Iron Throne (Core)', 'Consolidation of Power']);
        expect(this.queenscrown.kneeled).toBe(true);
        expect(this.player1).toBeAbleToSelect(this.fickleBannerman);
        expect(this.player1).not.toBeAbleToSelect(this.theIronThrone);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });

    it("places a revealed character in that player's discard pile and the others on the bottom of their deck", function () {
        setup.call(this, ['Fickle Bannerman', 'The Iron Throne (Core)', 'Consolidation of Power']);
        this.player1.clickCard(this.fickleBannerman);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.fickleBannerman.location).toBe('discard pile');
        expect(this.player2Object.drawDeck.slice(-2)).toContain(this.theIronThrone);
        expect(this.player2Object.drawDeck.slice(-2)).toContain(this.consolidationOfPower);
    });

    it('places Missandei in the discard pile without triggering her ability', function () {
        setup.call(this, ['Missandei', 'The Iron Throne (Core)', 'Consolidation of Power']);
        this.player1.clickCard(this.missandei);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.player2).not.toAllowAbilityTrigger('Missandei');
        expect(this.missandei.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('places all of them on the bottom of the deck if none is a character', function () {
        setup.call(this, ['Milk of the Poppy', 'Nightmares', 'Saving the Kingdom']);
        this.player1.clickPrompt('Done');
        const deck = this.player2Object.drawDeck;
        expect(deck.slice(-3).map((card) => card.name)).toEqual(
            expect.arrayContaining(['Milk of the Poppy', 'Nightmares', 'Saving the Kingdom'])
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
