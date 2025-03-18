import LeavePlay from '../../../server/game/GameActions/LeavePlay.js';

describe('LeavePlay', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'leavesPlay']);
        this.cardSpy.location = 'play area';

        this.props = { card: this.cardSpy, allowSave: true };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for (const location of ['active plot', 'faction', 'play area', 'title']) {
            describe(`when the card has location "${location}"`, function () {
                beforeEach(function () {
                    this.cardSpy.location = location;
                });

                it('returns true', function () {
                    expect(LeavePlay.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in play', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function () {
                expect(LeavePlay.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune', function () {
            beforeEach(function () {
                this.cardSpy.allowGameAction.and.returnValue(false);
            });

            it('returns false', function () {
                expect(LeavePlay.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = LeavePlay.createEvent(this.props);
            this.concurrentEvents = this.event.getConcurrentEvents();
        });

        it('creates an onCardLeftPlay event', function () {
            const eventObj = {
                name: 'onCardLeftPlay',
                card: this.cardSpy,
                allowSave: true,
                automaticSaveWithDupe: true,
                snapshotName: 'cardStateWhenLeftPlay'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        describe('when the card has a duplicate', function () {
            beforeEach(function () {
                this.dupeSpy = jasmine.createSpyObj('dupe', ['']);
                this.cardSpy.dupes = [this.dupeSpy];

                this.concurrentEvents = LeavePlay.createEvent(this.props).getConcurrentEvents();
            });

            it('creates a concurrent onCardDiscarded event', function () {
                const eventObj = {
                    name: 'onCardDiscarded',
                    card: this.dupeSpy
                };
                expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
            });
        });

        describe('when the card has a terminal attachment attached to it', function () {
            beforeEach(function () {
                this.terminalAttachmentSpy = jasmine.createSpyObj('terminalAttachment', [
                    'isTerminal'
                ]);
                this.terminalAttachmentSpy.isTerminal.and.returnValue(true);
                this.cardSpy.attachments = [this.terminalAttachmentSpy];

                this.concurrentEvents = LeavePlay.createEvent(this.props).getConcurrentEvents();
            });

            it('creates a concurrent onCardDiscarded event', function () {
                const eventObj = {
                    name: 'onCardDiscarded',
                    card: this.terminalAttachmentSpy
                };
                expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
            });
        });

        describe('when the card has a non-terminal attachment attached to it', function () {
            beforeEach(function () {
                this.nonTerminalAttachmentSpy = jasmine.createSpyObj('nonTerminalAttachment', [
                    'isTerminal'
                ]);
                this.nonTerminalAttachmentSpy.isTerminal.and.returnValue(false);
                this.cardSpy.attachments = [this.nonTerminalAttachmentSpy];

                this.concurrentEvents = LeavePlay.createEvent(this.props).getConcurrentEvents();
            });

            it('creates a concurrent onCardReturnedToHand event', function () {
                const eventObj = {
                    name: 'onCardReturnedToHand',
                    card: this.nonTerminalAttachmentSpy
                };
                expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
            });
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('calls leavePlay on the card', function () {
                expect(this.cardSpy.leavesPlay).toHaveBeenCalled();
            });
        });
    });
});
