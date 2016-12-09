/* global describe, it, beforeEach, expect, spyOn */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    beforeEach(function() {
        this.player = new Player('1', 'Player 1', true);
        this.player.deck = {};
        this.player.initialise();
        this.attachmentOwner = new Player('2', 'Player 2', false);
        this.attachmentOwner.initialise();
        this.attachment = new DrawCard(this.attachmentOwner, {});
        this.card = new DrawCard(this.player, {});
        this.player.cardsInPlay.push(this.card);
        this.player.attach(this.player, this.attachment, this.card.uuid);
        spyOn(this.player, 'moveCard');
        spyOn(this.attachmentOwner, 'moveCard');
    });

    describe('removeAttachment', function() {
        beforeEach(function() {
            spyOn(this.attachment, 'leavesPlay');
            spyOn(this.attachment, 'isTerminal');
        });

        describe('when the attachment has a duplicate', function() {
            beforeEach(function() {
                this.dupe = new DrawCard(this.attachmentOwner, {});
                this.attachment.addDuplicate(this.dupe);
                this.player.removeAttachment(this.attachment);
            });

            it('should remove the dupe', function() {
                expect(this.attachment.dupes).not.toContain(this.dupe);
            });

            it('should move the dupe in the owners discard pile', function() {
                expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.dupe, 'discard pile');
            });

            it('should not remove the attachment', function() {
                expect(this.card.attachments).toContain(this.attachment);
            });

            it('should not have the attachment leave play', function() {
                expect(this.attachment.leavesPlay).not.toHaveBeenCalled();
            });

            it('should not move the attachment', function() {
                expect(this.attachment.parent).toBe(this.card);
                expect(this.attachmentOwner.hand).not.toContain(this.attachment);
                expect(this.attachmentOwner.discardPile).not.toContain(this.attachment);
            });
        });

        describe('when the attachment has no duplicates', function() {
            describe('when the attachment is terminal', function() {
                beforeEach(function() {
                    this.attachment.isTerminal.and.returnValue(true);
                    this.player.removeAttachment(this.attachment);
                });

                it('should leave play', function() {
                    expect(this.attachment.leavesPlay).toHaveBeenCalled();
                });

                it('should remove the attachment from its parent', function() {
                    expect(this.card.attachments).not.toContain(this.attachment);
                });

                it('should unset its parent property', function() {
                    expect(this.attachment.parent).toBeUndefined();
                });

                it('should move the attachment to its owners discard pile', function() {
                    expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.attachment, 'discard pile');
                });
            });

            describe('when the attachment is not terminal', function() {
                beforeEach(function() {
                    this.attachment.isTerminal.and.returnValue(false);
                    this.player.removeAttachment(this.attachment);
                });

                it('should leave play', function() {
                    expect(this.attachment.leavesPlay).toHaveBeenCalled();
                });

                it('should remove the attachment from its parent', function() {
                    expect(this.card.attachments).not.toContain(this.attachment);
                });

                it('should unset its parent property', function() {
                    expect(this.attachment.parent).toBeUndefined();
                });

                it('should move the attachment to its owners hand', function() {
                    expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.attachment, 'hand');
                });
            });
        });

        describe('when the removal cannot be saved', function() {
            beforeEach(function() {
                this.dupe = new DrawCard(this.attachmentOwner, {});
                this.dupe2 = new DrawCard(this.attachmentOwner, {});
                this.attachment.addDuplicate(this.dupe);
                this.attachment.addDuplicate(this.dupe2);
                this.player.removeAttachment(this.attachment, false);
            });

            it('should remove all dupes', function() {
                expect(this.attachment.dupes.size()).toBe(0);
            });

            it('should place all dupes in the owners discard pile', function() {
                expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.dupe, 'discard pile');
                expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.dupe2, 'discard pile');
            });

            it('should leave play', function() {
                expect(this.attachment.leavesPlay).toHaveBeenCalled();
            });

            it('should remove the attachment from its parent', function() {
                expect(this.card.attachments).not.toContain(this.attachment);
            });

            it('should unset its parent property', function() {
                expect(this.attachment.parent).toBeUndefined();
            });

            it('should move the attachment to its owners hand', function() {
                expect(this.attachmentOwner.moveCard).toHaveBeenCalledWith(this.attachment, 'hand');
            });
        });
    });
});
