describe('Heir to the Iron Throne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Heir to the Iron Throne'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['Cersei Lannister (Core)', 'Tumblestone Knight']
            }
        });
        this.player1.selectPlot('Heir to the Iron Throne');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches the top 10 cards for a Lord or Lady and puts it into play, then sacrifices a Lord or Lady', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.serJaimeLannister);

        expect(this.cerseiLannister.location).toBe('play area');
        expect(this.serJaimeLannister.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Heir to the Iron Throne putting Arya Stark (Core) into play', function () {
    function reverseNamedCards(cards) {
        const named = cards.filter((card) => card.name !== 'House Maester');
        return [...named.reverse(), ...cards.filter((card) => !named.includes(card))];
    }

    it('shuffles and sacrifices before reactions to the character entering play', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Heir to the Iron Throne'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['Arya Stark (Core)', 'Hedge Knight', 'Castle Guard']
            }
        });
        this.player1.mockShuffle(reverseNamedCards);
        this.player1.selectPlot('Heir to the Iron Throne');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.aryaStark);
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.triggerAbility('Arya Stark');

        expect(this.serJaimeLannister.location).toBe('discard pile');
        expect(this.aryaStark.dupes).toContain(this.castleGuard);
    });
});
