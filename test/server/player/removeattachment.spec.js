/* global describe, it, beforeEach, expect, spyOn */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    beforeEach(function() {
        this.player = new Player('1', 'Player 1', true);
        this.player.initialise();
        this.attachmentOwner = new Player('2', 'Player 2', false);
        this.attachmentOwner.initialise();
        this.attachment = new DrawCard(this.attachmentOwner, {});
        this.card = new DrawCard(this.player, {});
        this.player.cardsInPlay.push(this.card);
        this.player.attach(this.attachment, this.card.uuid);
    });

    describe('removeAttachment', function() {
        beforeEach(function() {
            spyOn(this.attachment, 'leavesPlay');
            spyOn(this.attachment, 'isTerminal');
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

                it('should return the attachment to its owners discard pile', function() {
                    expect(this.attachmentOwner.hand).not.toContain(this.attachment);
                    expect(this.attachmentOwner.discardPile).toContain(this.attachment);
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

                it('should return the attachment to its owners hand', function() {
                    expect(this.attachmentOwner.hand).toContain(this.attachment);
                    expect(this.attachmentOwner.discardPile).not.toContain(this.attachment);
                });
            });
        });
    });
});
