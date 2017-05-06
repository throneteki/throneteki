/* global describe, it, beforeEach, expect, spyOn, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    describe('moveCard', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'raiseMergedEvent', 'getOtherPlayer', 'playerDecked']);
            this.player = new Player('1', 'Player 1', true, this.gameSpy);
            this.player.initialise();
            this.player.phase = 'marshal';

            this.gameSpy.raiseMergedEvent.and.callFake((name, params, handler) => {
                if(handler) {
                    handler(params);
                }
            });
            this.card = new DrawCard(this.player, { code: '1', name: 'Test' });
            spyOn(this.card, 'leavesPlay');
        });

        describe('when the card is not in a pile', function() {
            beforeEach(function() {
                this.card.location = '';
            });

            it('should add the card to the player hand', function() {
                this.player.moveCard(this.card, 'hand');
                expect(this.player.hand).toContain(this.card);
                expect(this.card.location).toBe('hand');
            });

            it('should add the card to the player discard pile', function() {
                this.player.moveCard(this.card, 'discard pile');
                expect(this.player.discardPile).toContain(this.card);
                expect(this.card.location).toBe('discard pile');
            });

            it('should add the card to the player dead pile', function() {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.player.deadPile).toContain(this.card);
                expect(this.card.location).toBe('dead pile');
            });

            it('should add the card to the player play area', function() {
                this.player.moveCard(this.card, 'play area');
                expect(this.player.cardsInPlay).toContain(this.card);
                expect(this.card.location).toBe('play area');
            });
        });

        describe('when the card is in a non-play-area pile', function() {
            beforeEach(function() {
                this.player.discardPile.push(this.card);
                this.card.location = 'discard pile';

                this.player.moveCard(this.card, 'hand');
            });

            it('should move it to the target pile', function() {
                expect(this.player.hand).toContain(this.card);
            });

            it('should remove it from the original pile', function() {
                expect(this.player.discardPile).not.toContain(this.card);
            });

            it('should not make the card leave play', function() {
                expect(this.card.leavesPlay).not.toHaveBeenCalled();
            });

            it('should not to raise the left play event', function() {
                expect(this.gameSpy.raiseEvent).not.toHaveBeenCalledWith('onCardLeftPlay', jasmine.any(Object), jasmine.any(Object));
            });
        });

        describe('when the card is in the play area', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.card);
                this.card.location = 'play area';
            });

            it('should make the card leave play', function() {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.card.leavesPlay).toHaveBeenCalled();
            });

            it('should raise the left play event', function() {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalled();
            });

            describe('when the card has attachments', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.card, 'hand');
                });

                it('should remove the attachments', function() {
                    expect(this.player.removeAttachment).toHaveBeenCalledWith(this.attachment, false);
                });
            });

            describe('when the card is an attachment', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.player, {});
                    this.attachment.parent = this.card;
                    this.attachment.location = 'play area';
                    this.card.attachments.push(this.attachment);
                    spyOn(this.player, 'removeAttachment');

                    this.player.moveCard(this.attachment, 'hand');
                });

                it('should place the attachment in the target pile', function() {
                    expect(this.player.hand).toContain(this.attachment);
                    expect(this.attachment.location).toBe('hand');
                });

                it('should remove the attachment from the card', function() {
                    expect(this.card.attachments).not.toContain(this.attachment);
                });
            });

            describe('when the card has duplicates', function() {
                beforeEach(function() {
                    this.dupe = new DrawCard(this.player, {});
                    this.card.addDuplicate(this.dupe);

                    this.player.moveCard(this.card, 'hand');
                });

                it('should discard the dupes', function() {
                    expect(this.player.discardPile).toContain(this.dupe);
                    expect(this.dupe.location).toBe('discard pile');
                });
            });
        });

        describe('when the target location is the draw deck', function() {
            beforeEach(function() {
                this.player.drawDeck = _([{}, {}, {}]);
            });

            it('should add the card to the top of the deck', function() {
                this.player.moveCard(this.card, 'draw deck');
                expect(this.player.drawDeck.first()).toBe(this.card);
            });

            it('should add the card to the bottom of the deck when the option is passed', function() {
                this.player.moveCard(this.card, 'draw deck', { bottom: true });
                expect(this.player.drawDeck.last()).toBe(this.card);
            });

            it('should be able to move a card from top to bottom of the deck', function() {
                this.player.drawDeck = _([this.card, {}, {}, {}]);
                this.card.location = 'draw deck';
                this.player.moveCard(this.card, 'draw deck', { bottom: true });
                expect(this.player.drawDeck.size()).toBe(4);
                expect(this.player.drawDeck.last()).toBe(this.card);
            });
        });

        describe('when the card location property and actual location do not match', function() {
            // Game.takeControl used to push the card directly onto cardsInPlay
            // but did not update the location for the card. This caused weird
            // problems where the strength of the card would be doubled for both
            // challenges and dominance.
            beforeEach(function() {
                // Put into play with the wrong location.
                this.card.location = 'discard pile';
                this.player.cardsInPlay = _([this.card]);

                this.player.moveCard(this.card, 'play area');
            });

            it('should not duplicate the card', function() {
                expect(this.player.cardsInPlay.size()).toBe(1);
                expect(this.player.cardsInPlay.toArray()).toEqual([this.card]);
            });
        });

        describe('when the target location is the active plot', function() {
            it('should set the card as the active plot', function() {
                this.player.moveCard(this.card, 'active plot');
                expect(this.player.activePlot).toBe(this.card);
            });
        });
    });
});
