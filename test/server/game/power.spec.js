const Game = require('../../../server/game/game.js');

describe('Game', function() {
    beforeEach(function() {
        let gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game({ owner: {} }, { gameService: gameService });

        this.source = jasmine.createSpyObj('source', ['allowGameAction']);
        this.source.allowGameAction.and.returnValue(true);
        this.target = { controller: jasmine.createSpyObj('controller', ['getTotalPower']) };

        this.target.power = 1;
        this.source.power = 2;
    });

    describe('movePower()', function() {
        describe('when the source has immunity', function() {
            beforeEach(function() {
                this.source.allowGameAction.and.returnValue(false);
                this.game.movePower(this.source, this.target, 2);
            });

            it('should not transfer power', function() {

                expect(this.target.power).toBe(1);
                expect(this.source.power).toBe(2);
            });
        });

        describe('when the source has enough power', function() {
            it('should transfer the exact amount of power', function() {
                this.game.movePower(this.source, this.target, 2);

                expect(this.target.power).toBe(3);
            });
        });

        describe('when the source does not have enough power', function() {
            beforeEach(function() {
                this.game.movePower(this.source, this.target, 3);
            });

            it('should increase the target power by the sources total power', function() {
                expect(this.target.power).toBe(3);
            });

            it('should set the sources power to 0', function() {
                expect(this.source.power).toBe(0);
            });
        });
    });
});
