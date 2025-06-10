import Kill from '../../../server/game/GameActions/Kill.js';

describe('Kill', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is in play and not immune', function () {
            it('returns true', function () {
                expect(Kill.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is not in play', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function () {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is not a character', function () {
            beforeEach(function () {
                this.cardSpy.getType.and.returnValue('location');
            });

            it('returns false', function () {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune', function () {
            beforeEach(function () {
                this.cardSpy.allowGameAction.and.returnValue(false);
            });

            it('returns false', function () {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.cardSpy.location = 'play area';
            this.concurrentEvents = Kill.createEvent(this.props).getConcurrentEvents();
        });

        it('creates an onCharacterKilled event', function () {
            const eventObj = {
                name: 'onCharacterKilled',
                card: this.cardSpy,
                allowSave: true,
                isBurn: false,
                snapshotName: 'cardStateWhenKilled'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });

        it('creates a concurrent onCardPlaced event', function () {
            const eventObj = {
                name: 'onCardPlaced',
                card: this.cardSpy,
                location: 'dead pile'
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
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
