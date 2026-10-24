describe('A Mission in Essos', function () {
    function setup(context, discard) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                shadows: ['A Mission in Essos (MoD)'],
                drawDeck: ['Hedge Knight', 'Winterfell Steward', 'Burned Men'],
                discard,
                gold: 2
            }
        });
        context.bottomCard = context.player1Object.drawDeck.at(-1);
        context.removed = context.player1Object.drawDeck.slice(0, -1);
        context.player1.clickCard(context.aMissionInEssos);
    }

    it('removes all but the bottom card of your deck from the game facedown, then shuffles your discard pile into your deck and draws 3 cards', function () {
        setup(this, ['Tumblestone Knight', 'House Dayne Knight', 'Bastard in Hiding']);
        for (const card of this.removed) {
            expect(card.location).toBe('out of game');
            expect(card.facedown).toBe(true);
        }
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1Object.drawDeck).toHaveLength(1);
        expect(this.player1Object.discardPile).toEqual([this.aMissionInEssos]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('still draws 3 cards when the discard pile is empty', function () {
        setup(this, []);
        expect(this.player1Object.hand).toEqual([this.bottomCard]);
        expect(this.player1).isReadyToTakeAction();
    });
});
