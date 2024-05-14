import Player from '../../../server/game/player.js';
import DrawCard from '../../../server/game/drawcard.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'addMessage',
            'queueSimpleStep',
            'raiseEvent',
            'resolveEvent'
        ]);
        this.gameSpy.queueSimpleStep.and.callFake((step) => step());
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.deck = {};
        this.player.initialise();
        this.attachmentOwner = new Player(
            '2',
            { username: 'Player 2', settings: {} },
            false,
            this.gameSpy
        );
        this.attachmentOwner.initialise();
        this.attachment = new DrawCard(this.attachmentOwner, {});
        spyOn(this.attachment, 'canAttach').and.returnValue(true);
        this.card = new DrawCard(this.player, {});
        this.card.location = 'play area';
        this.player.cardsInPlay.push(this.card);
        this.player.attach(this.player, this.attachment, this.card);

        this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
            if (handler) {
                handler(params);
            }
        });
    });

    describe('removeAttachment', function () {
        beforeEach(function () {
            spyOn(this.attachment, 'leavesPlay');
            spyOn(this.attachment, 'isTerminal');
        });

        describe('when the attachment is terminal', function () {
            beforeEach(function () {
                this.attachment.isTerminal.and.returnValue(true);
                this.player.removeAttachment(this.attachment);
            });

            it('should leave play', function () {
                expect(this.attachment.leavesPlay).toHaveBeenCalled();
            });

            it('should remove the attachment from its parent', function () {
                expect(this.card.attachments).not.toContain(this.attachment);
            });

            it('should unset its parent property', function () {
                expect(this.attachment.parent).toBeUndefined();
            });

            it('should return the attachment to its owners discard pile', function () {
                expect(this.attachmentOwner.hand).not.toContain(this.attachment);
                expect(this.attachmentOwner.discardPile).toContain(this.attachment);
            });
        });

        describe('when the attachment is not terminal', function () {
            beforeEach(function () {
                this.attachment.isTerminal.and.returnValue(false);
                this.player.removeAttachment(this.attachment);
            });

            it('should leave play', function () {
                expect(this.attachment.leavesPlay).toHaveBeenCalled();
            });

            it('should remove the attachment from its parent', function () {
                expect(this.card.attachments).not.toContain(this.attachment);
            });

            it('should unset its parent property', function () {
                expect(this.attachment.parent).toBeUndefined();
            });

            it('should return the attachment to its owners hand', function () {
                expect(this.attachmentOwner.hand).toContain(this.attachment);
                expect(this.attachmentOwner.discardPile).not.toContain(this.attachment);
            });
        });
    });
});
