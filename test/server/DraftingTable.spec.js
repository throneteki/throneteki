const DraftingTable = require('../../server/DraftingTable');
const DraftingPlayer = require('../../server/DraftingPlayer');

describe('DraftingTable', function() {
    beforeEach(function() {
        const starterCards = [
            { count: 1, cardCode: 'starter1' },
            { count: 1, cardCode: 'starter2' },
            { count: 1, cardCode: 'starter3' }
        ];
        this.draftCubeSpy = jasmine.createSpyObj('draftCube', ['generatePacks']);
        this.draftCubeSpy.generatePacks.and.callFake(() => {
            return [
                ['card1', 'card2'],
                ['card3', 'card4'],
                ['card5', 'card6'],
                ['card7', 'card8'],
                ['card9', 'card10'],
                ['card11', 'card12']
            ];
        });
        this.saveDeckSpy = jasmine.createSpy('saveDeck');
        this.draftingTable = new DraftingTable({
            draftCube: this.draftCubeSpy,
            event: {
                _id: 'event-id',
                draftOptions: {
                    draftCubeId: 'draft-cube-id'
                },
                name: 'Event 2021'
            },
            gameLog: jasmine.createSpyObj('gameLog', ['addAlert', 'addMessage']),
            messageBus: jasmine.createSpyObj('messageBus', ['emit']),
            numOfRounds: 2,
            players: [
                new DraftingPlayer({ user: { username: 'player1' }, starterCards }),
                new DraftingPlayer({ user: { username: 'player2' }, starterCards }),
                new DraftingPlayer({ user: { username: 'player3' }, starterCards })
            ],
            saveDeck: this.saveDeckSpy
        });

        this.player1 = this.draftingTable.getPlayer('player1');
        this.player2 = this.draftingTable.getPlayer('player2');
        this.player3 = this.draftingTable.getPlayer('player3');
    });

    describe('constructor', function() {
        it('generates packs from the cube deck', function() {
            expect(this.draftCubeSpy.generatePacks).toHaveBeenCalled();
        });

        it('immediately adds the starter cards to each player\'s deck', function() {
            expect(this.player1.deck).toEqual([
                { count: 1, code: 'starter1' },
                { count: 1, code: 'starter2' },
                { count: 1, code: 'starter3' }
            ]);
            expect(this.player2.deck).toEqual([
                { count: 1, code: 'starter1' },
                { count: 1, code: 'starter2' },
                { count: 1, code: 'starter3' }
            ]);
            expect(this.player3.deck).toEqual([
                { count: 1, code: 'starter1' },
                { count: 1, code: 'starter2' },
                { count: 1, code: 'starter3' }
            ]);
        });
    });

    describe('chooseCard', function() {
        const chooseCard = (draftingTable, playerName, card) => {
            draftingTable.chooseCard(playerName, card);
            draftingTable.confirmChosenCard(playerName);
        };

        describe('while a single player is choosing', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    chooseCard(this.draftingTable, 'player1', 'cardC');
                });

                it('does not modify the hand', function() {
                    expect(this.player1.hand).toEqual(['cardA', 'cardA', 'cardB']);
                });

                it('does not add to deck', function() {
                    expect(this.player1.deck).not.toContain({ count: 1, code: 'cardC' });
                });

                it('does not set the chosen flag', function() {
                    expect(this.player1.hasChosen).toBeFalse;
                });
            });

            describe('when the card is in hand', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    chooseCard(this.draftingTable, 'player1', 'cardA');
                });

                it('sets the hasChosen flag', function() {
                    expect(this.player1.hasChosen).toBe(true);
                });
            });

            describe('when the player cancels their selection', function() {
                beforeEach(function() {
                    this.player1.receiveNewHand(['cardA', 'cardA', 'cardB']);

                    chooseCard(this.draftingTable, 'player1', 'cardA');
                    this.draftingTable.cancelChosenCard('player1');
                });

                it('resets the hasChosen flag', function() {
                    expect(this.player1.hasChosen).toBe(false);
                });

                it('allows the player to choose another card', function() {
                    chooseCard(this.draftingTable, 'player1', 'cardB');
                    expect(this.player1.hasChosen).toBe(true);
                });
            });
        });

        describe('when not all players have chosen a card', function() {
            beforeEach(function() {
                this.draftingTable.rotateClockwise = true;

                this.player1.receiveNewHand(['cardA', 'cardB']);
                this.player2.receiveNewHand(['cardC', 'cardD']);
                this.player3.receiveNewHand(['cardE', 'cardF']);

                chooseCard(this.draftingTable, 'player1', 'cardA');
                chooseCard(this.draftingTable, 'player2', 'cardC');
            });

            it('it does not pick the cards until the last player also chooses their card', function() {
                expect(this.player1.chosenCards).toEqual([]);
                expect(this.player2.chosenCards).toEqual([]);
                expect(this.player3.chosenCards).toEqual([]);

                expect(this.player1.hasChosen).toBe(true);
                expect(this.player2.hasChosen).toBe(true);
                expect(this.player3.hasChosen).toBe(false);

                chooseCard(this.draftingTable, 'player3', 'cardE');

                expect(this.player1.hand).toEqual(['cardF']);
                expect(this.player2.hand).toEqual(['cardB']);
                expect(this.player3.hand).toEqual(['cardD']);
            });
        });

        describe('when all players have chosen and have cards left in hand', function() {
            beforeEach(function() {
                this.draftingTable.rotateClockwise = true;

                this.player1.receiveNewHand(['cardA', 'cardB']);
                this.player2.receiveNewHand(['cardC', 'cardD']);
                this.player3.receiveNewHand(['cardE', 'cardF']);

                chooseCard(this.draftingTable, 'player1', 'cardA');
                chooseCard(this.draftingTable, 'player2', 'cardC');
                chooseCard(this.draftingTable, 'player3', 'cardE');
            });

            it('rotates hands clockwise', function() {
                expect(this.player1.hand).toEqual(['cardF']);
                expect(this.player2.hand).toEqual(['cardB']);
                expect(this.player3.hand).toEqual(['cardD']);
            });

            it('allows players to choose the next card', function() {
                chooseCard(this.draftingTable, 'player1', 'cardF');
                chooseCard(this.draftingTable, 'player2', 'cardB');
                chooseCard(this.draftingTable, 'player3', 'cardD');

                expect(this.player1.deck).toContain({ count: 1, code: 'cardF' });
            });
        });

        describe('when all players choose the last card in hand and there are more drafting rounds', function() {
            beforeEach(function() {
                this.draftingTable.rotateClockwise = true;

                this.player1.receiveNewHand(['cardA']);
                this.player2.receiveNewHand(['cardC']);
                this.player3.receiveNewHand(['cardE']);

                chooseCard(this.draftingTable, 'player1', 'cardA');
                chooseCard(this.draftingTable, 'player2', 'cardC');
                chooseCard(this.draftingTable, 'player3', 'cardE');
            });

            it('draws new cards to hand', function() {
                expect(this.player1.hand).toEqual(['card1', 'card2']);
                expect(this.player2.hand).toEqual(['card3', 'card4']);
                expect(this.player3.hand).toEqual(['card5', 'card6']);
            });

            it('switches passing direction', function() {
                chooseCard(this.draftingTable, 'player1', 'card1');
                chooseCard(this.draftingTable, 'player2', 'card3');
                chooseCard(this.draftingTable, 'player3', 'card5');

                expect(this.player1.hand).toEqual(['card4']);
                expect(this.player2.hand).toEqual(['card6']);
                expect(this.player3.hand).toEqual(['card2']);
            });
        });

        describe('when all players choose the last card in hand and it is the last drafting round', function() {
            beforeEach(function() {
                this.draftingTable.startRound();

                // Round 1
                chooseCard(this.draftingTable, 'player1', 'card1');
                chooseCard(this.draftingTable, 'player2', 'card3');
                chooseCard(this.draftingTable, 'player3', 'card5');

                chooseCard(this.draftingTable, 'player1', 'card6');
                chooseCard(this.draftingTable, 'player2', 'card2');
                chooseCard(this.draftingTable, 'player3', 'card4');

                // Round 2
                chooseCard(this.draftingTable, 'player1', 'card7');
                chooseCard(this.draftingTable, 'player2', 'card9');
                chooseCard(this.draftingTable, 'player3', 'card11');

                chooseCard(this.draftingTable, 'player1', 'card10');
                chooseCard(this.draftingTable, 'player2', 'card12');
                chooseCard(this.draftingTable, 'player3', 'card8');
            });

            it('saves the final decks for each player', function() {
                expect(this.saveDeckSpy).toHaveBeenCalledWith({
                    deckName: 'Event 2021: Drafted Deck',
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
                    draftCubeId: 'draft-cube-id',
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    format: 'draft',
                    plotCards: [],
                    username: 'player1'
                });
                expect(this.saveDeckSpy).toHaveBeenCalledWith({
                    deckName: 'Event 2021: Drafted Deck',
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
                    draftCubeId: 'draft-cube-id',
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    format: 'draft',
                    plotCards: [],
                    username: 'player2'
                });
                expect(this.saveDeckSpy).toHaveBeenCalledWith({
                    deckName: 'Event 2021: Drafted Deck',
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
                    draftCubeId: 'draft-cube-id',
                    drawCards: [],
                    eventId: 'event-id',
                    faction: { value: 'baratheon' },
                    format: 'draft',
                    plotCards: [],
                    username: 'player3'
                });
            });
        });
    });
});
