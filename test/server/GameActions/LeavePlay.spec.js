import LeavePlay from '../../../server/game/GameActions/LeavePlay.js';

describe('LeavePlay', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', [
            'allowGameAction',
            'createSnapshot',
            'leavesPlay'
        ]);
        this.cardSpy.location = 'play area';
        this.cardSpy.createSnapshot.and.returnValue('SNAPSHOT');
        this.nonTerminalAttachmentSpy = jasmine.createSpyObj('nonTerminalAttachment', [
            'isTerminal'
        ]);
        this.nonTerminalAttachmentSpy.isTerminal.and.returnValue(false);
        this.terminalAttachmentSpy = jasmine.createSpyObj('terminalAttachment', ['isTerminal']);
        this.terminalAttachmentSpy.isTerminal.and.returnValue(true);
        this.dupeSpy = jasmine.createSpyObj('dupe', ['']);

        this.cardSpy.dupes = [this.dupeSpy];
        this.cardSpy.attachments = [this.nonTerminalAttachmentSpy, this.terminalAttachmentSpy];

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
        });

        it('creates a onCardLeftPlay event', function () {
            expect(this.event.name).toBe('onCardLeftPlay');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.allowSave).toBe(true);
            expect(this.event.automaticSaveWithDupe).toBe(true);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
                this.attachedEvents = this.event.attachedEvents.map((event) => ({
                    name: event.name,
                    card: event.card
                }));
            });

            it('calls leavePlay on the card', function () {
                expect(this.cardSpy.leavesPlay).toHaveBeenCalled();
            });

            it('creates a snapshot', function () {
                expect(this.event.snapshotName).toBe('cardStateWhenLeftPlay');
            });

            it('attaches discard events for the dupes', function () {
                expect(this.attachedEvents).toContain({
                    name: 'onCardDiscarded',
                    card: this.dupeSpy
                });
            });

            it('attaches discard events for terminal attachments', function () {
                expect(this.attachedEvents).toContain({
                    name: 'onCardDiscarded',
                    card: this.terminalAttachmentSpy
                });
            });

            it('attaches return to hand events for non-terminal attachments', function () {
                expect(this.attachedEvents).toContain({
                    name: 'onCardReturnedToHand',
                    card: this.nonTerminalAttachmentSpy
                });
            });
        });
    });
});
