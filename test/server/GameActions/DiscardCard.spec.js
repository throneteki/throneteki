import DiscardCard from '../../../server/game/GameActions/DiscardCard.js';

describe('DiscardCard', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for (let location of ['draw deck', 'hand', 'play area', 'shadows', 'duplicate']) {
            describe(`when the card is in ${location}`, function () {
                beforeEach(function () {
                    this.cardSpy.location = location;
                });

                it('returns true', function () {
                    expect(DiscardCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a discardable area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function () {
                expect(DiscardCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.concurrentEvents = DiscardCard.createEvent(this.props).getConcurrentEvents();
        });

        it('creates an onCardDiscarded event', function () {
            const eventObj = {
                name: 'onCardDiscarded',
                card: this.cardSpy,
                allowSave: true,
                snapshotName: 'cardStateWhenDiscarded'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        it('creates a concurrent onCardPlaced event', function () {
            const eventObj = {
                name: 'onCardPlaced',
                card: this.cardSpy,
                location: 'discard pile'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        describe('when the card is in play area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'play area';
                this.concurrentEvents = DiscardCard.createEvent(this.props).getConcurrentEvents();
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
