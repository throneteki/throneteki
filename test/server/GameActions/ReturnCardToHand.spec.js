const ReturnCardToHand = require('../../../server/game/GameActions/ReturnCardToHand');

describe('ReturnCardToHand', function() {
    beforeEach(function() {
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'createSnapshot']);
        this.cardSpy.controller = this.playerSpy;
        this.props = { card: this.cardSpy, allowSave: true };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['dead pile', 'discard pile', 'play area', 'shadows', 'duplicate']) {
            describe(`when the card is in ${location}`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                });

                it('returns true', function() {
                    expect(ReturnCardToHand.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in a returnable area', function() {
            beforeEach(function() {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function() {
                expect(ReturnCardToHand.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = ReturnCardToHand.createEvent(this.props);
        });

        it('creates a onCardReturnedToHand event', function() {
            expect(this.event.name).toBe('onCardReturnedToHand');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.allowSave).toBe(true);
        });

        describe('when the card is in play area', function() {
            beforeEach(function() {
                this.cardSpy.location = 'play area';
                const event = ReturnCardToHand.createEvent(this.props);
                this.returnCardEvent = event.getConcurrentEvents().find(event => event.name === 'onCardReturnedToHand');
                this.leaveEvent = event.getConcurrentEvents().find(event => event.name === 'onCardLeftPlay');
            });

            it('creates a onCardReturnedToHand event', function() {
                expect(this.returnCardEvent.name).toBe('onCardReturnedToHand');
                expect(this.returnCardEvent.card).toBe(this.cardSpy);
                expect(this.returnCardEvent.allowSave).toBe(true);
            });

            it('creates an onCardLeftPlay event', function() {
                expect(this.leaveEvent.name).toBe('onCardLeftPlay');
                expect(this.leaveEvent.card).toBe(this.cardSpy);
                expect(this.leaveEvent.allowSave).toBe(true);
            });
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.cardSpy.createSnapshot.and.returnValue('snapshot');
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function() {
                expect(this.event.cardStateWhenReturned).toBe('snapshot');
            });

            it('places the card in the hand', function() {
                const placeEvent = this.event.attachedEvents[0];
                expect(placeEvent.name).toBe('onCardPlaced');
                expect(placeEvent.card).toBe(this.cardSpy);
                expect(placeEvent.player).toBe(this.playerSpy);
                expect(placeEvent.location).toBe('hand');
            });
        });
    });
});
