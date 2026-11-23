describe('Without His Beard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lordsport Shipwright'], hand: ['Without His Beard'] },
            player2: {
                hand: ['Tumblestone Knight', 'Khal Drogo (Core)', 'Eddard Stark (Core)'],
                drawDeck: ['Hot Pie (FFH)', 'Burned Men']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.lordsportShipwright);
        this.player1.triggerAbility(this.withoutHisBeard);
        this.player1.clickPrompt('2');
        this.player2.clickPrompt('Done');
    });

    it("discards the chosen number of cards at random from the losing opponent's hand, then has them draw 2 cards", function () {
        expect(this.player2Object.discardPile).toHaveLength(3);
        expect(this.player2Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Without His Beard when the losing opponent has no cards in hand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lordsport Shipwright'], hand: ['Without His Beard'] },
            player2: { drawDeck: ['Hot Pie (FFH)', 'Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.lordsportShipwright);
    });

    it('cannot be played', function () {
        expect(this.player1).not.toAllowAbilityTrigger(this.withoutHisBeard);
        expect(this.withoutHisBeard.location).toBe('hand');
        expect(this.player2Object.hand).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
