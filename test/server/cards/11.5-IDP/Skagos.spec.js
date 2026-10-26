describe('Skagos (IDP)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Skagos (IDP)', 'Tumblestone Knight'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.inDeck = this.player1Object.drawDeck[0];
        this.player1.clickCard(this.skagos);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('sacrifices a standing [stark] card to put a card with the same title from your deck into play', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.skagos.location).toBe('play area');

        this.player1.clickCard(this.inDeck);

        expect(this.inDeck.location).toBe('play area');
        expect(this.skagos.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Skagos putting Umber Loyalist into play', function () {
    function reverseNamedCards(cards) {
        const named = cards.filter((card) => card.name !== 'House Maester');
        return [...named.reverse(), ...cards.filter((card) => !named.includes(card))];
    }

    it('shuffles the deck before Umber Loyalist draws', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Skagos (IDP)', 'Umber Loyalist'],
                drawDeck: ['Umber Loyalist', 'Hedge Knight', 'Castle Guard', 'Winterfell Steward']
            }
        });
        const inDeck = this.player1Object.drawDeck[0];
        this.player1.mockShuffle(reverseNamedCards);
        this.player1.clickCard(this.skagos);
        this.player1.clickCard(this.player1.findCardByName('Umber Loyalist', 'play area'));
        this.player1.clickCard(inDeck);
        this.player1.triggerAbility('Umber Loyalist');

        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
