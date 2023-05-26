const GainPower = require('../../../server/game/GameActions/GainPower');

describe('GainPower', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.cardSpy.controller = 'PLAYER_OBJ';
        this.cardSpy.game = this.gameSpy;
        this.cardSpy.power = 0;
        this.props = { card: this.cardSpy, amount: 3 };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['active plot', 'faction', 'play area']) {
            describe(`when the card is in ${location}`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                });

                it('returns true', function() {
                    expect(GainPower.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in an area that allows power', function() {
            beforeEach(function() {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(GainPower.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.event = GainPower.createEvent(this.props);
        });

        it('creates an onCardPowerGained event', function() {
            expect(this.event.name).toBe('onCardPowerGained');
            expect(this.event.card).toBe(this.cardSpy);
            expect(this.event.power).toBe(3);
        });

        describe('the event handler', function() {
            beforeEach(function() {
                this.event.executeHandler();
            });

            it('adds power to the card', function() {
                expect(this.cardSpy.power).toBe(3);
            });
        });
    });
});
