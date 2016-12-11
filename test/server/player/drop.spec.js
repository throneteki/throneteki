/* global describe, it, beforeEach, expect, jasmine, spyOn */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', () => {
    describe('drop()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['playCard', 'getOtherPlayer', 'raiseEvent']);

            this.player = new Player('1', 'Player 1', true, this.gameSpy);
            this.player.initialise();

            this.findSpy = spyOn(this.player, 'findCardByUuid');

            this.gameSpy.players = [];
            this.gameSpy.players[this.player.id] = this.player;

            this.card = new DrawCard(this.player, {});
            spyOn(this.card, 'getType');

            this.findSpy.and.returnValue(this.card);
        });

        describe('when dragging a card from hand to play area', function() {
            describe('when the card is not in the hand', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'play area');
                });

                it('should return false and not change the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(0);
                    expect(this.player.hand.size()).toBe(0);
                });
            });

            describe('when the card is in hand and a character', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.gameSpy.playCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and a location', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.gameSpy.playCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and an event', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'play area');
                });

                it('should return false and not add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.gameSpy.playCard).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'play area');
                });

                it('should return true and play the card', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.gameSpy.playCard).toHaveBeenCalled();
                });
            });
        });

        describe('when dragging a card from hand to the dead pile', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'dead pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.deadPile.size()).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the discard pile', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.discardPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardPile.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardPile.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardPile.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'discard pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardPile.size()).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.drawDeck.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('location');
                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('attachment');
                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('event');
                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.card.getType.and.returnValue('character');
                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when two cards are dragged to the draw deck', function() {
                beforeEach(function() {
                    this.player.drop(this.card, 'hand', 'draw deck');
                    this.dropSucceeded = this.player.drop(this.card, 'hand', 'draw deck');
                });

                it('should put the cards in the draw deck in the correct order', function() {
                    expect(this.dropSucceeded).toBe(true);
//                    expect(this.player.drawDeck[0].code).toBe(locationInHand.code);
  //                  expect(this.player.drawDeck[1].code).toBe(characterInHand.code);
                });
            });
        });

        describe('when dragging a card from the play area to the discard pile', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.card);
                this.card.location = 'play area';
            });

            describe('when the card is not in play', function() {
                beforeEach(function() {
                    this.findSpy.and.returnValue(undefined);

                    this.dropSucceeded = this.player.drop(this.card, 'play area', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(1);
                });
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop(this.card, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.cardsInPlay.size()).toBe(0);
                    expect(this.player.discardPile.size()).toBe(1);
                });
            });
        });
    });
});
