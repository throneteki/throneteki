const DiscardPower = require('../../../server/game/GameActions/DiscardPower');

describe('DiscardPower', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction']);
        this.cardSpy.controller = 'PLAYER_OBJ';
        this.cardSpy.game = this.gameSpy;
        this.cardSpy.power = 1;
        this.props = { card: this.cardSpy, amount: 3 };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        for(let location of ['active plot', 'faction', 'play area']) {
            describe(`when the card is in ${location} and has power`, function() {
                beforeEach(function() {
                    this.cardSpy.location = location;
                    this.cardSpy.power = 1;
                });

                it('returns true', function() {
                    expect(DiscardPower.allow(this.props)).toBe(true);
                });
            });
        }

        describe('when the card is not in an area that allows power', function() {
            beforeEach(function() {
                this.cardSpy.location = 'dead pile';
            });

            it('returns false', function() {
                expect(DiscardPower.allow(this.props)).toBe(false);
            });
        });

        describe('when the card does not have power', function() {
            beforeEach(function() {
                this.cardSpy.location = 'play area';
                this.cardSpy.power = 0;
            });

            it('returns false', function() {
                expect(DiscardPower.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        describe('when the card has enough power', function() {
            beforeEach(function() {
                this.cardSpy.power = 3;
                this.props.amount = 2;
                this.event = DiscardPower.createEvent(this.props);
            });

            it('creates an onCardPowerDiscarded event', function() {
                expect(this.event.name).toBe('onCardPowerDiscarded');
                expect(this.event.card).toBe(this.cardSpy);
                expect(this.event.power).toBe(2);
            });

            describe('the event handler', function() {
                beforeEach(function() {
                    this.event.executeHandler();
                });

                it('removes power from the card', function() {
                    expect(this.cardSpy.power).toBe(1);
                });
            });
        });

        describe('when the card does not have enough power', function() {
            beforeEach(function() {
                this.cardSpy.power = 1;
                this.props.amount = 3;
                this.event = DiscardPower.createEvent(this.props);
            });

            it('creates an onCardPowerDiscarded event', function() {
                expect(this.event.name).toBe('onCardPowerDiscarded');
                expect(this.event.card).toBe(this.cardSpy);
                expect(this.event.power).toBe(1);
            });

            describe('the event handler', function() {
                beforeEach(function() {
                    this.event.executeHandler();
                });

                it('removes power from the card', function() {
                    expect(this.cardSpy.power).toBe(0);
                });
            });
        });
    });
});
