/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['raiseEvent']);
        this.player = jasmine.createSpyObj('player', ['discardCard']);
        this.player.game = this.game;
        this.card = new DrawCard(this.player, {});
        this.card.setBlank();
    });

    describe('clearBlank()', function() {
        it('should remove blanking', function() {
            this.card.clearBlank();
            expect(this.card.isBlank()).toBe(false);
        });

        describe('when the card has attachments', function() {
            beforeEach(function() {
                this.attachment = {};
                this.card.attachments.push(this.attachment);
            });

            describe('and it will still be valid after unblanking', function() {
                beforeEach(function() {
                    spyOn(this.card, 'allowAttachment').and.returnValue(true);
                });

                it('should not discard the attachment', function() {
                    this.card.clearBlank();
                    expect(this.player.discardCard).not.toHaveBeenCalled();
                });
            });

            describe('and it will no longer be valid after unblanking', function() {
                beforeEach(function() {
                    spyOn(this.card, 'allowAttachment').and.returnValue(false);
                });

                it('should discard the attachment without allowing saves', function() {
                    this.card.clearBlank();
                    expect(this.player.discardCard).toHaveBeenCalledWith(this.attachment, false);
                });
            });
        });
    });
});
