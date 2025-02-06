import PlaceCardUnderneath from '../../../server/game/GameActions/PlaceCardUnderneath.js';

describe('PlaceCardUnderneath', function () {
    beforeEach(function () {
        this.controllerSpy = jasmine.createSpyObj('player', ['removeCardFromPile']);
        this.controllerSpy.drawDeck = [];

        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.cardSpy.location = 'hand';
        this.cardSpy.controller = this.controllerSpy;

        this.parentSpy = jasmine.createSpyObj('parent', ['addChildCard']);
        this.parentSpy.controller = this.controllerSpy;
        this.parentSpy.underneath = [];

        this.props = { card: this.cardSpy, parentCard: this.parentSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is being placed under a card in a different location', function () {
            beforeEach(function () {
                this.parentSpy.location = 'play area';
            });

            it('returns true', function () {
                expect(PlaceCardUnderneath.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is being placed under a card it is currently under', function () {
            beforeEach(function () {
                this.parentSpy.location = 'play area';
                this.parentSpy.underneath = [this.cardSpy];
            });

            it('returns false', function () {
                expect(PlaceCardUnderneath.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is being placed under a card in an invalid location', function () {
            beforeEach(function () {
                this.parentSpy.location = 'draw deck';
            });

            it('returns false', function () {
                expect(PlaceCardUnderneath.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = PlaceCardUnderneath.createEvent(this.props);
        });

        it('creates a onCardPlacedUnderneath event', function () {
            expect(this.event.name).toBe('onCardPlacedUnderneath');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.parentCard).toBe(this.parentSpy);
            expect(this.event.facedown).toBe(false);
        });

        describe('the event handler', function () {
            describe('when the target location is in-play', function () {
                beforeEach(function () {
                    this.parentSpy.location = 'play area';
                    this.event.executeHandler();
                });

                it('removes it from current pile', function () {
                    expect(this.controllerSpy.removeCardFromPile).toHaveBeenCalledWith(
                        this.cardSpy
                    );
                });

                it('adds it as a child to the parent', function () {
                    expect(this.parentSpy.addChildCard).toHaveBeenCalledWith(
                        this.cardSpy,
                        'underneath'
                    );
                });
            });

            describe('when the target location is under an agenda', function () {
                beforeEach(function () {
                    this.controllerSpy.agenda = this.parentSpy;
                    this.event.executeHandler();
                });

                it('removes it from current pile', function () {
                    expect(this.controllerSpy.removeCardFromPile).toHaveBeenCalledWith(
                        this.cardSpy
                    );
                });

                it('adds it as a child to the agenda', function () {
                    expect(this.parentSpy.addChildCard).toHaveBeenCalledWith(
                        this.cardSpy,
                        'underneath'
                    );
                });
            });
        });
    });
});
