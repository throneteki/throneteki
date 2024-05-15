import KneelCard from '../../../server/game/GameActions/KneelCard.js';

describe('KneelCard', function () {
    beforeEach(function () {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.cardSpy.kneeled = false;
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
                    expect(KneelCard.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is already kneeled', function () {
            beforeEach(function () {
                this.cardSpy.kneeled = true;
            });

            it('returns false', function () {
                expect(KneelCard.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is not in a kneelable area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function () {
                expect(KneelCard.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function () {
        beforeEach(function () {
            this.event = KneelCard.createEvent(this.props);
        });

        it('creates a onCardKneeled event', function () {
            expect(this.event.name).toBe('onCardKneeled');
            expect(this.event.card).toBe(this.cardSpy);
        });

        describe('the event handler', function () {
            beforeEach(function () {
                this.event.executeHandler();
            });

            it('kneels the card', function () {
                expect(this.cardSpy.kneeled).toBe(true);
            });
        });
    });
});
