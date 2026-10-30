describe('Daenerys Targaryen (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Daenerys Targaryen (DotE)'],
                drawDeck: ['Tumblestone Knight', 'Drogon (Core)']
            }
        });

        this.player1.clickCard(this.daenerysTargaryen);
    });

    it('searches the top 10 cards for an attachment or Dragon, and may put one with printed cost 3 or lower into play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.drogon);
        this.player1.clickPrompt('Put in play');

        expect(this.drogon.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Daenerys Targaryen (DotE) putting an attachment into play', function () {
    function reverseNamedCards(cards) {
        const named = cards.filter((card) => card.name !== 'House Maester');
        return [...named.reverse(), ...cards.filter((card) => !named.includes(card))];
    }

    it('shuffles the deck before reactions to the attachment entering play', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Valyrian Steel (LMHR)',
                inPlay: ['Daenerys Targaryen (DotE)'],
                drawDeck: [
                    'Hedge Knight',
                    'Little Bird (Core)',
                    'Castle Guard',
                    'Winterfell Steward'
                ]
            }
        });
        this.player1.mockShuffle(reverseNamedCards);
        this.player1.clickCard(this.daenerysTargaryen);
        this.player1.clickCard(this.littleBird);
        this.player1.clickPrompt('Put in play');
        this.player1.clickCard(this.daenerysTargaryen);
        this.player1.triggerAbility('Valyrian Steel');
        this.player1.clickPrompt('Draw 1 card');

        expect(this.littleBird.parent).toBe(this.daenerysTargaryen);
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
