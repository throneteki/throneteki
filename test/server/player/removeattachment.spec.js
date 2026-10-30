import Player from '../../../server/game/player.js';
import DrawCard from '../../../server/game/drawcard.js';
import { executeTestEvent, resolveGameAction } from '../../helpers/gameactiontesthelper.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = {
            addMessage: vi.fn(),
            queueSimpleStep: vi.fn(),
            raiseEvent: vi.fn(),
            resolveEvent: vi.fn((event) => executeTestEvent(event))
        };
        this.gameSpy.resolveGameAction = vi.fn((action, props) =>
            resolveGameAction(this.gameSpy, action, props)
        );
        this.gameSpy.queueSimpleStep.mockImplementation((step) => step());
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
        vi.spyOn(this.attachment, 'canAttach').mockReturnValue(true);
        this.card = new DrawCard(this.player, {});
        this.card.location = 'play area';
        this.player.cardsInPlay.push(this.card);
        this.player.attach(this.player, this.attachment, this.card);

        this.gameSpy.raiseEvent.mockImplementation((name, params, handler) => {
            if (handler) {
                handler(params);
            }
        });
    });

    describe('removeAttachment', function () {
        beforeEach(function () {
            vi.spyOn(this.attachment, 'leavesPlay').mockImplementation(() => {});
            vi.spyOn(this.attachment, 'isTerminal').mockImplementation(() => {});
        });

        describe('when the attachment is terminal', function () {
            beforeEach(function () {
                this.attachment.isTerminal.mockReturnValue(true);
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
                this.attachment.isTerminal.mockReturnValue(false);
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
