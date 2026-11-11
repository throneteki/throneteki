import Game from '../../../server/game/game.js';

describe('Game', function () {
    beforeEach(function () {
        this.gameService = { save: vi.fn() };
        this.game = new Game({ owner: {} }, { gameService: this.gameService });

        this.player = { isSpectator: vi.fn() };
        this.player.name = 'Player 1';

        this.game.playersAndSpectators[this.player.name] = this.player;

        this.chatCommands = this.game.chatCommands;
        this.gameChat = this.game.gameChat;
        vi.spyOn(this.chatCommands, 'executeCommand').mockReturnValue(false);
        vi.spyOn(this.gameChat, 'addChatMessage').mockImplementation(() => {});
    });

    describe('chat()', function () {
        describe('when called by a player not in the game', function () {
            it('should not add any chat messages', function () {
                this.game.chat('notinthegame', 'Test Message');

                expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
            });
        });

        describe('when called by a player in the game', function () {
            describe('and the message is a command', function () {
                beforeEach(function () {
                    this.chatCommands.executeCommand.mockReturnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should execute the command', function () {
                    expect(this.chatCommands.executeCommand).toHaveBeenCalledWith(
                        this.player,
                        '/this',
                        ['/this', 'is', 'a', 'command']
                    );
                });

                it('should not add any chat messages', function () {
                    expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
                });
            });

            describe('and the message is a not a valid command', function () {
                beforeEach(function () {
                    this.chatCommands.executeCommand.mockReturnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function () {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(
                        expect.any(String),
                        this.player,
                        'this is a message'
                    );
                });
            });
        });

        describe('when called by a spectator in the game', function () {
            beforeEach(function () {
                this.player.isSpectator.mockReturnValue(true);
            });

            describe('and the message is a command', function () {
                beforeEach(function () {
                    this.chatCommands.executeCommand.mockReturnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should not execute the command', function () {
                    expect(this.chatCommands.executeCommand).not.toHaveBeenCalled();
                });

                it('should add it as a chat messages', function () {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(
                        expect.any(String),
                        this.player,
                        '/this is a command'
                    );
                });
            });

            describe('and the message is a not a valid command', function () {
                beforeEach(function () {
                    this.chatCommands.executeCommand.mockReturnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function () {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(
                        expect.any(String),
                        this.player,
                        'this is a message'
                    );
                });
            });
        });
    });
});
