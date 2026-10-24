describe('The Bear and the Maiden Fair', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['"The Bear and the Maiden Fair"'], gold: 2 },
            player2: {
                drawDeck: [
                    'Hedge Knight',
                    'Winterfell Steward',
                    'Burned Men',
                    'Tumblestone Knight',
                    'House Dayne Knight',
                    'Bastard in Hiding'
                ]
            }
        });
        this.player1.clickCard(this.theBearAndTheMaidenFair);
        this.player1.clickPrompt('player2');
    });

    it('places all 5 on top in any order if none go on the bottom', function () {
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        expect(this.player2Object.drawDeck.slice(0, 6)).toEqual([
            this.houseDayneKnight,
            this.hedgeKnight,
            this.winterfellSteward,
            this.burnedMen,
            this.tumblestoneKnight,
            this.bastardInHiding
        ]);
        expect(this.player1).isReadyToTakeAction();
    });

    it("looks at the top 5 cards of a player's deck", function () {
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.houseDayneKnight);
        expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
    });

    it('places up to 3 of them on the bottom and the others on top, in any order', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        const deck = this.player2Object.drawDeck;
        expect(deck.slice(0, 4)).toEqual([
            this.houseDayneKnight,
            this.winterfellSteward,
            this.tumblestoneKnight,
            this.bastardInHiding
        ]);
        expect(deck.slice(-2)).toEqual([this.burnedMen, this.hedgeKnight]);
        expect(this.player1).isReadyToTakeAction();
    });
});
