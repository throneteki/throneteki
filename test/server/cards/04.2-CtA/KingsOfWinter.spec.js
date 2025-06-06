import KingsOfWinter from '../../../../server/game/cards/04.2-CtA/KingsOfWinter.js';
import CardStat from '../../../../server/game/cardstat.js';

describe('Kings Of Winter', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getPlayers', 'on']);

        this.plot1 = jasmine.createSpyObj('plot1', ['hasTrait']);
        this.plot1.income = new CardStat(0);
        this.plot1.reserve = new CardStat(0);
        this.plot2 = jasmine.createSpyObj('plot2', ['hasTrait']);
        this.plot2.income = new CardStat(0);
        this.plot2.reserve = new CardStat(0);
        this.plot3 = jasmine.createSpyObj('plot3', ['hasTrait']);
        this.plot3.income = new CardStat(0);
        this.plot3.reserve = new CardStat(0);

        this.plot1.hasTrait.and.callFake((trait) => {
            return trait === 'Summer';
        });
        this.plot2.hasTrait.and.returnValue(false);

        this.player1Fake = {};
        this.player1Fake.game = this.gameSpy;
        this.player1Fake.activePlot = this.plot1;
        this.plot1.controller = this.player1Fake;
        this.plot3.controller = this.player1Fake;

        this.player2Fake = {};
        this.player2Fake.game = this.gameSpy;
        this.player2Fake.activePlot = this.plot2;
        this.plot2.controller = this.player2Fake;

        this.gameSpy.getPlayers.and.returnValue([this.player1Fake, this.player2Fake]);

        this.context = {};

        this.agenda = new KingsOfWinter(this.player1Fake, {});
    });

    describe('reserve persistent effect', function () {
        beforeEach(function () {
            this.reserveEffect = this.agenda.abilities.persistentEffects[0];
        });

        it('should target all players', function () {
            expect(this.reserveEffect.targetController).toBe('any');
        });

        it('should match with active plots', function () {
            expect(this.reserveEffect.match(this.plot1)).toBe(true);
            // Belongs to player 1 but is not active.
            expect(this.reserveEffect.match(this.plot3)).toBe(false);
        });

        it('should reduce the plots reserve', function () {
            this.reserveEffect.effect.apply(this.plot1, this.context);
            expect(this.plot1.reserve.modifier).toBe(-1);
        });
    });

    describe('gold persistent effect', function () {
        beforeEach(function () {
            this.goldEffect = this.agenda.abilities.persistentEffects[1];
        });

        it('should reduce the gold on the plot', function () {
            this.goldEffect.effect.apply(this.plot1, this.context);
            expect(this.plot1.income.modifier).toBe(-1);
        });

        describe('when the current player does not have a Winter', function () {
            beforeEach(function () {
                this.plot1.hasTrait.and.returnValue(false);
            });

            it('should not pass the activation condition', function () {
                expect(this.goldEffect.condition()).toBe(false);
            });
        });

        describe('when the current player has a Winter plot', function () {
            beforeEach(function () {
                this.plot1.hasTrait.and.callFake((trait) => trait === 'Winter');
            });

            describe('and opponent has a Summer plot', function () {
                beforeEach(function () {
                    this.plot2.hasTrait.and.callFake((trait) => trait === 'Summer');
                });

                it('should pass the activation condition', function () {
                    expect(this.goldEffect.condition()).toBe(true);
                });

                it('should not match the plot', function () {
                    expect(this.goldEffect.match(this.plot2)).toBe(false);
                });
            });

            describe('and opponent does not have a Summer plot', function () {
                beforeEach(function () {
                    this.plot2.hasTrait.and.returnValue(false);
                });

                it('should pass the activation condition', function () {
                    expect(this.goldEffect.condition()).toBe(true);
                });

                it('should match the plot', function () {
                    expect(this.goldEffect.match(this.plot2)).toBe(true);
                });
            });
        });
    });
});
