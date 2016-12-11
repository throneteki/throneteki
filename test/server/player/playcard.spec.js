/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent']);
        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function() {
        beforeEach(function() {
            this.canPlaySpy = spyOn(this.player, 'canPlayCard');
            this.card = new DrawCard(this.player, {});
            spyOn(this.card, 'getType');
            spyOn(this.card, 'isLimited');
            spyOn(this.card, 'play');
            this.dupeCardSpy = jasmine.createSpyObj('dupecard', ['addDuplicate']);

            this.canPlaySpy.and.returnValue(true);
            this.player.hand.push(this.card);
            this.card.location = 'hand';
        });

        describe('when card is not in hand to play', function() {
            beforeEach(function() {
                this.player.hand.pop();
                this.canPlay = this.player.playCard('not found');
            });

            it('should return false', function() {
                expect(this.canPlay, false).toBe(false);
            });

            it('should not put the card in play', function() {
                expect(this.player.cardsInPlay).not.toContain(this.card);
            });
        });

        describe('when card cannot be played', function() {
            beforeEach(function() {
                this.canPlaySpy.and.returnValue(false);
            });

            describe('and not forcing play', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.card.uuid, false);
                });

                it('should return false', function() {
                    expect(this.canPlay).toBe(false);
                });

                it('should not change the hand', function() {
                    expect(this.player.hand).toContain(this.card);
                });
            });

            describe('and forcing play', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.card.uuid, true);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should remove the card from hand', function() {
                    expect(this.player.hand).not.toContain(this.card);
                });
            });
        });

        describe('when card is an attachment', function() {
            beforeEach(function() {
                spyOn(this.player, 'promptForAttachment');

                this.card.getType.and.returnValue('attachment');
            });

            describe('and there is no duplicate out', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.card.uuid);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).toHaveBeenCalled();
                });

                it('should not remove the card from hand', function() {
                    expect(this.player.hand).toContain(this.card);
                });
            });

            describe('and there is a duplicate out', function() {
                beforeEach(function() {
                    spyOn(this.player, 'getDuplicateInPlay').and.returnValue(this.dupeCardSpy);
                    this.canPlay = this.player.playCard(this.card.uuid);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should not prompt for attachment target', function() {
                    expect(this.player.promptForAttachment).not.toHaveBeenCalled();
                });

                it('should remove the card from hand', function() {
                    expect(this.player.hand).not.toContain(this.card);
                });

                it('should add a duplicate to the existing card in play', function() {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalledWith(this.card);
                });

                it('should not add a new card to play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.card);
                });
            });
        });

        describe('when card is a duplicate of a card in play', function() {
            beforeEach(function() {
                spyOn(this.player, 'getDuplicateInPlay').and.returnValue(this.dupeCardSpy);
            });

            describe('and this is the setup phase', function() {
                beforeEach(function() {
                    this.player.phase = 'setup';

                    this.canPlay = this.player.playCard(this.card.uuid);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should not try to add a duplicate to the card in play', function() {
                    expect(this.dupeCardSpy.addDuplicate).not.toHaveBeenCalled();
                });

                it('should add a new card in play facedown', function() {
                    expect(this.player.cardsInPlay).toContain(this.card);
                    expect(this.card.facedown).toBe(true);
                    expect(this.card.play).toHaveBeenCalledWith(this.player);
                });
            });

            describe('and this is not the setup phase', function() {
                beforeEach(function() {
                    this.canPlay = this.player.playCard(this.card.uuid);
                });

                it('should return true', function() {
                    expect(this.canPlay).toBe(true);
                });

                it('should add a duplicate to the existing card in play', function() {
                    expect(this.dupeCardSpy.addDuplicate).toHaveBeenCalled();
                });

                it('should not add a new card to play', function() {
                    expect(this.player.cardsInPlay).not.toContain(this.card);
                });
            });
        });

        describe('when card is limited and not forcing play', function() {
            beforeEach(function() {
                this.card.isLimited.and.returnValue(true);
                this.canPlay = this.player.playCard(this.card.uuid);
            });

            it('should set the limited played flag', function() {
                expect(this.player.limitedPlayed).toBe(1);
            });
        });

        describe('when card is limited and forcing play', function() {
            beforeEach(function() {
                this.card.isLimited.and.returnValue(true);
                this.canPlay = this.player.playCard(this.card.uuid, true);
            });

            it('should not set the limited played flag', function() {
                expect(this.player.limitedPlayed).toBe(0);
            });
        });
    });
});
