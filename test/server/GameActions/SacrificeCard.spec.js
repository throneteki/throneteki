import SacrificeCard from '../../../server/game/GameActions/SacrificeCard.js';

describe('SacrificeCard', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'createSnapshot']);
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
            this.events = SacrificeCard.createEvent(this.props).getConcurrentEvents();
        });

        it('creates a onSacrificed event', function () {
            const event = this.events.find((e) => e.name === 'onSacrificed');
            expect(event).toBeDefined();
            expect(event.card).toBe(this.cardSpy);
            expect(event.player).toBe(this.player1Object);
        });

        it('creates an onCardLeftPlay event', function () {
            const event = this.events.find((e) => e.name === 'onCardLeftPlay');
            expect(event).toBeDefined();
            expect(event.card).toBe(this.cardSpy);
            expect(event.allowSave).toBe(false);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event = this.events.find((e) => e.name === 'onSacrificed');
                this.cardSpy.createSnapshot.and.returnValue('snapshot');
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function () {
                expect(this.event.cardStateWhenSacrificed).toBe('snapshot');
            });

            it('places the card in the discard pile', function () {
                const placeEvent = this.event.attachedEvents[0];
                expect(placeEvent.name).toBe('onCardPlaced');
                expect(placeEvent.card).toBe(this.cardSpy);
                expect(placeEvent.location).toBe('discard pile');
            });
        });
    });
});
