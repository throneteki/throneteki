describe('Return to the Fields (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Return to the Fields (KotI)'],
                inPlay: ['Hedge Knight', 'Steward at the Wall', 'Castle Guard'],
                drawDeck: [
                    'Winterfell Steward',
                    'Lannisport Merchant',
                    'Garden Caretaker',
                    'Desert Scavenger',
                    'Targaryen Loyalist',
                    'Iron Islands Fishmonger'
                ]
            }
        });
        this.player1.selectPlot('Return to the Fields');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('sacrifices up to 3 characters, then draws 1 card and gains 1 gold for each', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.stewardAtTheWall.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.player1Object.hand.length).toBe(2 + 2);
        expect(this.player1Object.gold).toBe(4 + 2);
    });
});

describe('Return to the Fields (KotI) when no characters are sacrificed', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Return to the Fields (KotI)'],
                inPlay: ['Hedge Knight', 'Castle Guard']
            }
        });
        this.player1.selectPlot('Return to the Fields');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('lets you choose not to sacrifice any', function () {
        expect(this.player1).toHavePromptButton('Done');
        this.player1.clickPrompt('Done');

        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.game.getPlainTextLog()).not.toContain('to sacrifice');
        expect(this.game.getPlainTextLog()).not.toContain('Then player1 draws');
        expect(this.player1).isReadyToTakeAction();
    });
});
