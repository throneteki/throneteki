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
        spyOn(game, 'raiseEvent');
        spyOn(player1, 'getDominance');
        spyOn(player2, 'getDominance');
    });

    describe('the determineDominance() function', () => {
        describe('when dominance strength is a tie', () => {
            beforeEach(() => {
                player1.getDominance.and.returnValue(5);
                player2.getDominance.and.returnValue(5);
            });

            it('should not determine a winner', () => {
                phase.determineDominance();
                expect(game.raiseEvent).toHaveBeenCalledWith('onDominanceDetermined', jasmine.objectContaining({ winner: undefined, difference: 0, chosenBy: undefined }), jasmine.any(Function));
            });
            // TODO: Add scenario to choose winner from tie
        });
        
        describe('when dominance strength is not tied', () => {
            beforeEach(() => {
                player1.getDominance.and.returnValue(3);
                player2.getDominance.and.returnValue(5);
            });

            it('should determine a winner', () => {
                phase.determineDominance();
                expect(game.raiseEvent).toHaveBeenCalledWith('onDominanceDetermined', jasmine.objectContaining({ winner: player2, difference: 2, chosenBy: undefined }), jasmine.any(Function));
            });
        });
    });
});