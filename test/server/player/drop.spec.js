const Player = require('../../../server/game/player.js');

describe('Player', () => {
    describe('drop()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'playerDecked']);

            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
            this.player.initialise();
            spyOn(this.player, 'discardCard');
            spyOn(this.player, 'putIntoPlay');

            this.gameSpy.playersAndSpectators = [];
            this.gameSpy.playersAndSpectators[this.player.name] = this.player;

            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'leavesPlay', 'moveTo']);
            this.cardSpy.controller = this.cardSpy.owner = this.player;
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.attachments = [];
            this.cardSpy.dupes = [];
        });

        describe('when no card is pased', function() {
            beforeEach(function() {
                this.dropSucceeded = this.player.drop(null, 'hand', 'draw deck');
            });

            it('should return false', function() {
                expect(this.dropSucceeded).toBe(false);
            });
        });

        describe('when dragging a card from hand to play area', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is in hand and a character', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });

            describe('when the card is in hand and a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });

            describe('when the card is in hand and an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                it('should return false and not add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.putIntoPlay).not.toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                it('should return true and play the card', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });
        });

        describe('when dragging a card from hand to the dead pile', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.deadPile.length).toBe(0);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.deadPile.length).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the discard pile', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('character');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and put the character in the dead pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.length).toBe(1);
                });
            });

            describe('when the card is in hand and is a character', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('character');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.length).toBe(1);
                });
            });

            describe('when two cards are dragged to the draw deck', function() {
                beforeEach(function() {
                    this.cardSpy2 = jasmine.createSpyObj('card', ['getType', 'moveTo']);
                    this.cardSpy2.controller = this.player;
                    this.cardSpy2.owner = this.player;
                    this.cardSpy2.getType.and.returnValue('event');
                    this.player.hand.push(this.cardSpy2);
                    this.cardSpy2.location = 'hand';

                    this.player.drop(this.cardSpy, 'hand', 'draw deck');
                    this.dropSucceeded = this.player.drop(this.cardSpy2, 'hand', 'draw deck');
                });

                it('should put the cards in the draw deck in the correct order', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.slice(0, 2)).toEqual([this.cardSpy2, this.cardSpy]);
                });
            });
        });

        describe('when dragging a card from the play area to the discard pile', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });
        });

        describe('event order', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
                this.cardSpy.getType.and.returnValue('character');
            });

            it('should rely on killCharacter to maintain event order', function() {
                spyOn(this.player, 'killCharacter');

                let result = this.player.drop(this.cardSpy, 'play area', 'dead pile');
                expect(result).toBe(true);
                expect(this.player.killCharacter).toHaveBeenCalledWith(this.cardSpy, false);
            });
        });
    });
});
