describe('Tris Botley', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tris Botley'] },
            player2: { discard: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.trisBotley, 'Remove card from game');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("removes a card in an opponent's discard pile from the game", function () {
        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Tris Botley when the opponent has a copy of the removed card to duplicate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tris Botley'] },
            player2: {
                inPlay: ['Arya Stark (Core)'],
                hand: ['Arya Stark (Core)'],
                discard: ['Arya Stark (Core)']
            }
        });
        this.aryaInPlay = this.player2.findCardByName('Arya Stark', 'play area');
        this.aryaInDiscard = this.player2.findCardByName('Arya Stark', 'discard pile');
        this.aryaInHand = this.player2.findCardByName('Arya Stark', 'hand');
        this.player1.clickMenu(this.trisBotley, 'Remove card from game');
        this.player1.clickCard(this.aryaInDiscard);
        this.player1.clickPrompt('Done');
    });

    it('does not stop them marshaling it as a duplicate', function () {
        expect(this.aryaInDiscard.location).toBe('out of game');

        this.player2.clickCard(this.aryaInHand);

        expect(this.aryaInHand.location).toBe('duplicate');
        expect(this.aryaInPlay.dupes).toContain(this.aryaInHand);
        expect(this.player2).isReadyToTakeAction();
    });
});
