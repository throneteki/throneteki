import ReturnCardToHand from '../../../server/game/GameActions/ReturnCardToHand.js';

describe('ReturnCardToHand', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for (let location of ['dead pile', 'discard pile', 'play area', 'shadows', 'duplicate']) {
            describe(`when the card is in ${location}`, function () {
                beforeEach(function () {
                    this.cardSpy.location = location;
                });

                it('returns true', function () {
                    expect(ReturnCardToHand.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a returnable area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function () {
                expect(ReturnCardToHand.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.concurrentEvents = ReturnCardToHand.createEvent(this.props).getConcurrentEvents();
        });

        it('creates an onCardReturnedToHand event', function () {
            const eventObj = {
                name: 'onCardReturnedToHand',
                card: this.cardSpy,
                allowSave: true,
                snapshotName: 'cardStateWhenReturned'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        it('creates a concurrent onCardPlaced event', function () {
            const eventObj = {
                name: 'onCardPlaced',
                card: this.cardSpy,
                location: 'hand'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        describe('when the card is in play area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'play area';
                this.concurrentEvents = ReturnCardToHand.createEvent(
                    this.props
                ).getConcurrentEvents();
            });

            it('creates a concurrent onCardLeftPlay event', function () {
                const eventObj = {
                    name: 'onCardLeftPlay',
                    card: this.cardSpy
                };
                expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
            });
        });
    });
});
