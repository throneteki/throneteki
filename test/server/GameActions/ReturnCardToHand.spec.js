const ReturnCardToHand = require('../../../server/game/GameActions/ReturnCardToHand');

describe('ReturnCardToHand', function() {
    beforeEach(function() {
        this.playerSpy = jasmine.createSpyObj('player', ['moveCard']);
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

        describe('the event handler', function() {
            beforeEach(function() {
                this.cardSpy.createSnapshot.and.returnValue('snapshot');
                this.event.executeHandler();
            });

            it('sets the card snapshot on the event', function() {
                expect(this.event.cardStateWhenReturned).toBe('snapshot');
            });

            it('moves the card to hand', function() {
                expect(this.playerSpy.moveCard).toHaveBeenCalledWith(this.cardSpy, 'hand', { allowSave: true });
            });
        });
    });
});
