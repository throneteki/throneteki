import Game from '../../../server/game/game.js';

describe('Game tie winner chooser', function () {
    it('asks the first player to select a controller and keeps that selection until sources change', function () {
        const firstPlayer = {
            name: 'first player',
            choosesWinnerForInitiativeTies: true
        };
        const secondPlayer = {
            name: 'second player',
            choosesWinnerForInitiativeTies: true
        };
        const candidates = [firstPlayer, secondPlayer];
        const game = {
            tieWinnerChooserRevisions: { initiative: 2, dominance: 0 },
            tieWinnerChooserSelections: {},
            getPlayersInFirstPlayerOrder: () => candidates,
            getFirstPlayer: () => firstPlayer,
            queueStep: vi.fn()
        };
        const selectedControllers = [];

        Game.prototype.chooseTieWinnerController.call(game, 'initiative', (player) =>
            selectedControllers.push(player)
        );
        const prompt = game.queueStep.mock.calls[0][0];

        expect(prompt.player).toBe(firstPlayer);
        expect(prompt.activePromptTitle).toBe('Choose which player chooses tie winners');

        prompt.onSelect(secondPlayer);
        Game.prototype.chooseTieWinnerController.call(game, 'initiative', (player) =>
            selectedControllers.push(player)
        );

        expect(selectedControllers).toEqual([secondPlayer, secondPlayer]);
        expect(game.queueStep).toHaveBeenCalledTimes(1);

        Game.prototype.tieWinnerChooserChanged.call(game, 'initiative');
        expect(game.tieWinnerChooserSelections.initiative).toBeUndefined();
    });
});
