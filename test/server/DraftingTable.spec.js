const DraftingTable = require('../../server/DraftingTable.js');

describe('DraftingTable', function() {
    beforeEach(function() {
        this.cubeDeck = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9', 'card10', 'card11', 'card12'];
        this.shuffleFunc = jasmine.createSpy('shuffle');
        this.shuffleFunc.and.callFake(deck => deck);
        this.deckServiceSpy = jasmine.createSpyObj('deckService', ['create']);
        this.draftingTable = new DraftingTable({
            cardPool: this.cubeDeck,
            deckService: this.deckServiceSpy,
            event: {
                _id: 'event-id',
                name: 'Event 2021'
            },
            numOfRounds: 2,
            numCardsPerRound: 2,
            playerNames: ['player1', 'player2', 'player3'],
            starterCards: ['starter1', 'starter2', 'starter3'],
            shuffle: this.shuffleFunc
        });
        this.player1 = this.draftingTable.getPlayer('player1');
        this.player2 = this.draftingTable.getPlayer('player2');
        this.player3 = this.draftingTable.getPlayer('player3');
    });

    describe('constructor', function() {
        it('shuffles the cube deck', function() {
            expect(this.shuffleFunc).toHaveBeenCalledWith(this.cubeDeck);
        });

        it('immediately adds the starter cards to each player\'s deck', function() {
            expect(this.player1.deck).toEqual(['starter1', 'starter2', 'starter3']);
            expect(this.player2.deck).toEqual(['starter1', 'starter2', 'starter3']);
            expect(this.player3.deck).toEqual(['starter1', 'starter2', 'starter3']);
        });
    });

    describe('chooseCard', function() {
        describe('while a single player is choosing', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    this.draftingTable.chooseCard('player1', 'cardC');
                });

                it('does not modify the hand', function() {
                    expect(this.player1.hand).toEqual(['cardA', 'cardA', 'cardB']);
                });

                it('does not add to deck', function() {
                    expect(this.player1.deck).not.toContain('cardC');
                });
            });

            describe('when the card is in hand', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    this.draftingTable.chooseCard('player1', 'cardA');
                });

                it('removes the single card from the hand', function() {
                    expect(this.player1.hand).toEqual(['cardA', 'cardB']);
                });

                it('adds the card to the player\'s deck', function() {
                    expect(this.player1.deck).toContain('cardA');
                });
            });

            describe('when the player has already chosen a card this round', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    this.draftingTable.chooseCard('player1', 'cardA');
                    // Choose again
                    this.draftingTable.chooseCard('player1', 'cardB');
                });

                it('does not remove the second card from hand', function() {
                    expect(this.player1.hand).toEqual(['cardA', 'cardB']);
                });

                it('does not add the second card to the player\'s deck', function() {
                    expect(this.player1.deck).not.toContain('cardB');
                });
            });
        });

        describe('when all players have chosen and have cards left in hand', function() {
            beforeEach(function() {
                this.player1.receiveNewHand(['cardA', 'cardB']);
                this.player2.receiveNewHand(['cardC', 'cardD']);
                this.player3.receiveNewHand(['cardE', 'cardF']);

                this.draftingTable.chooseCard('player1', 'cardA');
                this.draftingTable.chooseCard('player2', 'cardC');
                this.draftingTable.chooseCard('player3', 'cardE');
            });

            it('rotates hands clockwise', function() {
                expect(this.player1.hand).toEqual(['cardF']);
                expect(this.player2.hand).toEqual(['cardB']);
                expect(this.player3.hand).toEqual(['cardD']);
            });

            it('allows players to choose the next card', function() {
                this.draftingTable.chooseCard('player1', 'cardF');

                expect(this.player1.hand).toEqual([]);
                expect(this.player1.deck).toContain('cardF');
            });
        });

        describe('when all players choose the last card in hand and there are more drafting rounds', function() {
            beforeEach(function() {
                this.player1.receiveNewHand(['cardA']);
                this.player2.receiveNewHand(['cardC']);
                this.player3.receiveNewHand(['cardE']);

                this.draftingTable.chooseCard('player1', 'cardA');
                this.draftingTable.chooseCard('player2', 'cardC');
                this.draftingTable.chooseCard('player3', 'cardE');
            });

            it('draws new cards to hand', function() {
                expect(this.player1.hand).toEqual(['card1', 'card2']);
                expect(this.player2.hand).toEqual(['card3', 'card4']);
                expect(this.player3.hand).toEqual(['card5', 'card6']);
            });

            it('switches passing direction', function() {
                this.draftingTable.chooseCard('player1', 'card1');
                this.draftingTable.chooseCard('player2', 'card3');
                this.draftingTable.chooseCard('player3', 'card5');

                expect(this.player1.hand).toEqual(['card4']);
                expect(this.player2.hand).toEqual(['card6']);
                expect(this.player3.hand).toEqual(['card2']);
            });
        });

        describe('when all players choose the last card in hand and it is the last drafting round', function() {
            beforeEach(function() {
                // Round 1
                this.draftingTable.drawHands();
                this.draftingTable.chooseCard('player1', 'card1');
                this.draftingTable.chooseCard('player2', 'card3');
                this.draftingTable.chooseCard('player3', 'card5');

                this.draftingTable.chooseCard('player1', 'card6');
                this.draftingTable.chooseCard('player2', 'card2');
                this.draftingTable.chooseCard('player3', 'card4');

                // Round 2
                this.draftingTable.chooseCard('player1', 'card7');
                this.draftingTable.chooseCard('player2', 'card9');
                this.draftingTable.chooseCard('player3', 'card11');

                this.draftingTable.chooseCard('player1', 'card10');
                this.draftingTable.chooseCard('player2', 'card12');
                this.draftingTable.chooseCard('player3', 'card8');
            });

            it('saves the final decks for each player', function() {
                expect(this.deckServiceSpy.create).toHaveBeenCalledWith({
                    name: 'Event 2021: Drafted Deck',
                    bannerCards: [],
                    draftedCards: [
                        { count: 1, code: 'starter1' },
                        { count: 1, code: 'starter2' },
                        { count: 1, code: 'starter3' },
                        { count: 1, code: 'card1' },
                        { count: 1, code: 'card6' },
                        { count: 1, code: 'card7' },
                        { count: 1, code: 'card10' }
                    ],
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    plotCards: [],
                    username: 'player1'
                });
                expect(this.deckServiceSpy.create).toHaveBeenCalledWith({
                    name: 'Event 2021: Drafted Deck',
                    bannerCards: [],
                    draftedCards: [
                        { count: 1, code: 'starter1' },
                        { count: 1, code: 'starter2' },
                        { count: 1, code: 'starter3' },
                        { count: 1, code: 'card3' },
                        { count: 1, code: 'card2' },
                        { count: 1, code: 'card9' },
                        { count: 1, code: 'card12' }
                    ],
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    plotCards: [],
                    username: 'player2'
                });
                expect(this.deckServiceSpy.create).toHaveBeenCalledWith({
                    name: 'Event 2021: Drafted Deck',
                    bannerCards: [],
                    draftedCards: [
                        { count: 1, code: 'starter1' },
                        { count: 1, code: 'starter2' },
                        { count: 1, code: 'starter3' },
                        { count: 1, code: 'card5' },
                        { count: 1, code: 'card4' },
                        { count: 1, code: 'card11' },
                        { count: 1, code: 'card8' }
                    ],
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    plotCards: [],
                    username: 'player3'
                });
            });
        });
    });
});
