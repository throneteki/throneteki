const PlaceCard = require('../../../server/game/GameActions/PlaceCard');

describe('PlaceCard', function() {
    beforeEach(function() {
        this.controllerSpy = jasmine.createSpyObj('player', ['placeCardInPile']);
        this.controllerSpy.drawDeck = [];
        this.ownerSpy = jasmine.createSpyObj('player', ['placeCardInPile']);
        this.ownerSpy.drawDeck = [];

        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'leavesPlay']);
        this.cardSpy.location = 'play area';
        this.cardSpy.controller = this.controllerSpy;
        this.cardSpy.owner = this.ownerSpy;

        this.props = { card: this.cardSpy, location: 'discard pile', bottom: false};
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is being placed in a different location', function() {
            beforeEach(function() {
                this.cardSpy.location = 'play area';
                this.props.location = 'discard pile';
            });

            it('returns true', function() {
                expect(PlaceCard.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is being placed in the same location', function() {
            beforeEach(function() {
                this.cardSpy.location = 'discard pile';
                this.props.location = 'discard pile';
            });

            it('returns false', function() {
                expect(PlaceCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is on top of the draw deck', function() {
            beforeEach(function() {
                this.cardSpy.location = 'draw deck';
                this.ownerSpy.drawDeck = [this.cardSpy, this.otherCardSpy];
                this.props.location = 'draw deck';
            });

            describe('and is placed on top', function() {
                beforeEach(function() {
                    this.props.bottom = false;
                });

                it('returns false', function() {
                    expect(PlaceCard.allow(this.props)).toBe(false);
                });
            });

            describe('and is placed on bottom', function() {
                beforeEach(function() {
                    this.props.bottom = true;
                });

                it('returns true', function() {
                    expect(PlaceCard.allow(this.props)).toBe(true);
                });
            });
        });

        describe('when the card is on bottom of the draw deck', function() {
            beforeEach(function() {
                this.cardSpy.location = 'draw deck';
                this.ownerSpy.drawDeck = [this.otherCardSpy, this.cardSpy];
                this.props.location = 'draw deck';
            });

            describe('and is placed on top', function() {
                beforeEach(function() {
                    this.props.bottom = false;
                });

                it('returns true', function() {
                    expect(PlaceCard.allow(this.props)).toBe(true);
                });
            });

            describe('and is placed on bottom', function() {
                beforeEach(function() {
                    this.props.bottom = true;
                });

                it('returns false', function() {
                    expect(PlaceCard.allow(this.props)).toBe(false);
                });
            });
        });
    });

    xdescribe('createEvent()', function() {
        beforeEach(function() {
            this.event = PlaceCard.createEvent(this.props);
        });

        it('creates a onCardLeftPlay event', function() {
            expect(this.event.name).toBe('onCardPlaced');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.location).toBe('discard pile');
            expect(this.event.bottom).toBe(false);
        });

        describe('the event handler', function() {
            describe('when the target location is in-play', function() {
                beforeEach(function() {
                    this.props.location = 'play area';
                    this.event.executeHandler();
                });

                it('places in the controller pile', function() {
                    expect(this.controllerSpy.placeCardInPile).toHaveBeenCalledWith({
                        card: this.cardSpy,
                        location: 'play area',
                        bottom: false
                    });
                });
            });

            describe('when the target location is out-of-play', function() {
                beforeEach(function() {
                    this.props.location = 'discard pile';
                    this.event.executeHandler();
                });

                it('places in the owner pile', function() {
                    expect(this.ownerSpy.placeCardInPile).toHaveBeenCalledWith({
                        card: this.cardSpy,
                        location: 'play area',
                        bottom: false
                    });
                });
            });
        });
    });
});
