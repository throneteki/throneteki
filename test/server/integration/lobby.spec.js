import Lobby from '../../../server/lobby.js';

describe('lobby', function () {
    beforeEach(function () {
        this.socketSpy = { joinChannel: vi.fn(), send: vi.fn() };
        this.ioSpy = { set: vi.fn(), use: vi.fn(), on: vi.fn(), emit: vi.fn() };
        this.routerSpy = { on: vi.fn() };
        this.userSpy = { getDetails: vi.fn(), hasUserBlocked: vi.fn() };
        this.userSpy.username = 'test';
        this.userSpy.getDetails.mockReturnValue({ username: 'test' });
        this.userSpy.hasUserBlocked.mockReturnValue(false);

        this.socketSpy.user = this.userSpy;
        this.socketSpy.id = 'socket1';

        this.cardService = {
            getTitleCards: vi.fn(),
            getAllCards: vi.fn(),
            getRestrictedList: vi.fn()
        };
        this.cardService.getTitleCards.mockReturnValue(Promise.resolve([]));
        this.cardService.getAllCards.mockReturnValue(Promise.resolve([]));
        this.cardService.getRestrictedList.mockReturnValue(
            Promise.resolve([{ name: 'Default RL', banned: [], restricted: [] }])
        );

        this.userService = { on: vi.fn() };

        this.messageService = { on: vi.fn() };

        this.eventService = { getEventById: vi.fn() };

        this.lobby = new Lobby(
            {},
            {
                io: this.ioSpy,
                messageService: this.messageService,
                cardService: this.cardService,
                deckService: {},
                eventService: this.eventService,
                userService: this.userService,
                router: this.routerSpy,
                config: {}
            }
        );
        this.lobby.sockets[this.socketSpy.id] = this.socketSpy;
    });

    describe('onNewGame', function () {
        describe('when called once', function () {
            beforeEach(async function () {
                await this.lobby.onNewGame(this.socketSpy, { eventId: 'none' });
            });

            it('should create a new game with the player in it', function () {
                expect(Object.values(this.lobby.games).length).toBe(1);
                var gamesArray = Object.values(this.lobby.games);
                var player = gamesArray[0].players['test'];

                expect(player.name).toBe('test');
            });
        });

        describe('when called twice', function () {
            beforeEach(async function () {
                await this.lobby.onNewGame(this.socketSpy, { eventId: 'none' });
                await this.lobby.onNewGame(this.socketSpy, { eventId: 'none' });
            });

            it('should only create 1 game', function () {
                expect(Object.values(this.lobby.games).length).toBe(1);
            });
        });

        describe('when the user is restricted', function () {
            beforeEach(function () {
                this.userSpy.trustState = 'restricted';
                this.userSpy.restrictedUntil = new Date(Date.now() + 60 * 1000);
                this.lobby.onNewGame(this.socketSpy, { eventId: 'none' });
            });

            it('should reject the new game', function () {
                expect(Object.values(this.lobby.games).length).toBe(0);
                expect(this.socketSpy.send).toHaveBeenCalledWith(
                    'gameerror',
                    'This account is temporarily restricted and cannot create new games.'
                );
            });
        });
    });
});
