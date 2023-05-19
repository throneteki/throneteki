const MovePower = require('../../../server/game/GameActions/MovePower');

describe('MovePower', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.fromCardSpy = jasmine.createSpyObj('from', ['allowGameAction']);
        this.fromCardSpy.controller = 'FROM_PLAYER_OBJ';
        this.fromCardSpy.game = this.gameSpy;
        this.fromCardSpy.location = 'play area';
        this.fromCardSpy.power = 1;
        this.toCardSpy = jasmine.createSpyObj('to', ['allowGameAction']);
        this.toCardSpy.controller = 'TO_PLAYER_OBJ';
        this.toCardSpy.location = 'play area';
        this.toCardSpy.game = this.gameSpy;
        this.toCardSpy.power = 0;
        this.props = { from: this.fromCardSpy, to: this.toCardSpy, amount: 3 };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.fromCardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['active plot', 'faction', 'play area']) {
            describe(`when the from card is in ${location}`, function() {
                beforeEach(function() {
                    this.fromCardSpy.location = location;
                });

                it('returns true', function() {
                    expect(MovePower.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when amount is not positive', function() {
            beforeEach(function() {
                this.props.amount = 0;
            });

            it('returns false', function() {
                expect(MovePower.allow(this.props)).toBe(false);
            });
        });

        describe('when the from card has no power', function() {
            beforeEach(function() {
                this.fromCardSpy.power = 0;
            });

            it('returns false', function() {
                expect(MovePower.allow(this.props)).toBe(false);
            });
        });

        describe('when the from card is not in an area that allows power', function() {
            beforeEach(function() {
                this.fromCardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(MovePower.allow(this.props)).toBe(false);
            });
        });

        describe('when the to card is not in an area that allows power', function() {
            beforeEach(function() {
                this.toCardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(MovePower.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = MovePower.createEvent(this.props);
        });

        it('creates an onCardPowerMoved event', function() {
            expect(this.event.name).toBe('onCardPowerMoved');
            expect(this.event.source).toBe(this.fromCardSpy);
            expect(this.event.target).toBe(this.toCardSpy);
            expect(this.event.power).toBe(1);
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.event.executeHandler();
            });

            it('removes power from the from card', function() {
                expect(this.fromCardSpy.power).toBe(0);
            });

            it('adds the amount of power removed to the to card', function() {
                expect(this.toCardSpy.power).toBe(1);
            });
        });
    });
});
