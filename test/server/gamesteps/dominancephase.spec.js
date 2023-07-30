const DominancePhase = require('../../../server/game/gamesteps/dominancephase.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Settings = require('../../../server/settings.js');

describe('the DominancePhase', () => {
    var phase;
    var game = {};
    var player1;
    var player2;

    beforeEach(() => {
        let gameService = jasmine.createSpyObj('gameService', ['save']);
        game = new Game({ owner: {} }, { gameService: gameService });
        player1 = new Player('1', Settings.getUserWithDefaultsSet({ username: 'Player 1' }), true, game);
        player2 = new Player('2', Settings.getUserWithDefaultsSet({ username: 'Player 2' }), false, game);
        player2.firstPlayer = true;
        game.playersAndSpectators['Player 1'] = player1;
        game.playersAndSpectators['Player 2'] = player2;
        phase = new DominancePhase(game);
        spyOn(game, 'addPower');
        spyOn(player1, 'getDominance');
        spyOn(player2, 'getDominance');
    });

    describe('the determineWinner() function', () => {
        describe('when dominance strength is a tie', () => {
            beforeEach(() => {
                player1.getDominance.and.returnValue(5);
                player2.getDominance.and.returnValue(5);
            });

            it('should not award any power', () => {
                phase.determineWinner();
                expect(game.addPower).not.toHaveBeenCalled();
            });
            // TODO: Add scenario for dominance tied, and one player winning ties (that player should win)
            // TODO: Add scenario for dominance tied, and more than one player winning ties (nobody should win)
        });

        describe('when dominance strength is not tied', () => {
            beforeEach(() => {
                player1.getDominance.and.returnValue(3);
                player2.getDominance.and.returnValue(5);
            });

            it('should award power to the winner', () => {
                phase.determineWinner();
                expect(game.addPower).toHaveBeenCalledWith(player2, 1);
            });
        });
    });
});
