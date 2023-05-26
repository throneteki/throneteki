const PlaceToken = require('../../../server/game/GameActions/PlaceToken');

describe('PlaceToken', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'modifyToken']);
        this.cardSpy.location = 'play area';
        this.props = { card: this.cardSpy, token: 'TOKEN_TYPE', amount: 2 };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['active plot', 'agenda', 'play area', 'shadows', 'title']) {
            describe(`when the card is in ${location}`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                });

                it('returns true', function() {
                    expect(PlaceToken.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is out of play', function() {
            beforeEach(function() {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(PlaceToken.allow(this.props)).toBe(false);
            });
        });

        describe('when amount is not positive', function() {
            beforeEach(function() {
                this.props.amount = 0;
            });

            it('returns false', function() {
                expect(PlaceToken.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = PlaceToken.createEvent(this.props);
        });

        it('creates an onTokenPlaced event', function() {
            expect(this.event.name).toBe('onTokenPlaced');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.token).toBe('TOKEN_TYPE');
            expect(this.event.amount).toBe(2);
            expect(this.event.desiredAmount).toBe(2);
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.event.executeHandler();
            });

            it('adds the token to the card', function() {
                expect(this.cardSpy.modifyToken).toHaveBeenCalledWith('TOKEN_TYPE', 2);
            });
        });
    });
});
