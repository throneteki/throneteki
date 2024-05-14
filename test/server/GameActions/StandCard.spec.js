import StandCard from '../../../server/game/GameActions/StandCard.js';

describe('StandCard', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.cardSpy.kneeled = true;
        this.cardSpy.location = 'play area';
        this.props = { card: this.cardSpy };
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for (let location of ['faction', 'play area']) {
            describe(`when the card is in ${location}`, function () {
                beforeEach(function () {
                    this.cardSpy.location = location;
                });

                it('returns true', function () {
                    expect(StandCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is already standing', function () {
            beforeEach(function () {
                this.cardSpy.kneeled = false;
            });

            it('returns false', function () {
                expect(StandCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is not in a kneelable area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function () {
                expect(StandCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = StandCard.createEvent(this.props);
        });

        it('creates a onCardStood event', function () {
            expect(this.event.name).toBe('onCardStood');
            expect(this.event.card).toBe(this.cardSpy);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('stands the card', function () {
                expect(this.cardSpy.kneeled).toBe(false);
            });
        });
    });
});
