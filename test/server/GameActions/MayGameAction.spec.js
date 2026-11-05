import MayGameAction from '../../../server/game/GameActions/MayGameAction.js';

describe('MayGameAction', function () {
    it('outputs the decline message with the choosing player', function () {
        const player = { name: 'player1' };
        const game = {
            addMessage: vi.fn(),
            promptWithMenu: vi.fn()
        };
        const action = new MayGameAction({
            player,
            gameAction: { allow: () => true },
            declineMessage: '{choosingPlayer} declines'
        });
        const event = action.createEvent({ game, player, source: {} });

        event.executeHandler();
        const promptHandler = game.promptWithMenu.mock.calls[0][1];
        promptHandler.handle(player, false);

        expect(game.addMessage.mock.calls[0][0]).toBe('{3} declines');
        expect(game.addMessage.mock.calls[0][4]).toBe(player);
    });
});
