const SacrificeCard = require('../../../server/game/GameActions/SacrificeCard');

describe('SacrificeCard', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'createSnapshot']);
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is in play and not immune', function() {
            it('returns true', function() {
                expect(SacrificeCard.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is not in play', function() {
            beforeEach(function() {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function() {
                expect(SacrificeCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune', function() {
            beforeEach(function() {
                this.cardSpy.allowGameAction.and.returnValue(false);
            });

            it('returns false', function() {
                expect(SacrificeCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = SacrificeCard.createEvent(this.props);
        });

        it('creates a onSacrificed event', function() {
            expect(this.event.name).toBe('onSacrificed');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.player).toBe(this.player1Object);
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.cardSpy.createSnapshot.and.returnValue('snapshot');
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function() {
                expect(this.event.cardStateWhenSacrificed).toBe('snapshot');
            });

            it('places the card in the discard pile', function() {
                const placeEvent = this.event.attachedEvents[0];
                expect(placeEvent.name).toBe('onCardPlaced');
                expect(placeEvent.card).toBe(this.cardSpy);
                expect(placeEvent.location).toBe('discard pile');
            });
        });
    });
});
