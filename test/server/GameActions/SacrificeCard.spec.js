import SacrificeCard from '../../../server/game/GameActions/SacrificeCard.js';

describe('SacrificeCard', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is in play and not immune', function () {
            it('returns true', function () {
                expect(SacrificeCard.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is not in play', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function () {
                expect(SacrificeCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune to sacrifice', function () {
            beforeEach(function () {
                this.cardSpy.allowGameAction.and.callFake(
                    (actionName) => actionName !== 'sacrifice'
                );
            });

            it('returns false', function () {
                expect(SacrificeCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune to leaving play', function () {
            beforeEach(function () {
                this.cardSpy.allowGameAction.and.callFake(
                    (actionName) => actionName !== 'leavePlay'
                );
            });

            it('returns false', function () {
                expect(SacrificeCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.cardSpy.location = 'play area';
            this.concurrentEvents = SacrificeCard.createEvent(this.props).getConcurrentEvents();
        });

        it('creates an onSacrificed event', function () {
            const eventObj = {
                name: 'onSacrificed',
                card: this.cardSpy,
                player: this.player1Object,
                snapshotName: 'cardStateWhenSacrificed'
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

        it('creates a concurrent onCardLeftPlay event', function () {
            const eventObj = {
                name: 'onCardLeftPlay',
                card: this.cardSpy
            };
            expect(this.concurrentEvents).toContain(jasmine.objectContaining(eventObj));
        });
    });
});
