import Game from '../../../server/game/game.js';
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

        describe('when the game is for an event that sets the game options', function () {
            beforeEach(async function () {
                this.eventService.getEventById.mockResolvedValue({
                    _id: '7',
                    name: 'Regionals',
                    format: 'joust',
                    variant: 'standard',
                    legality: 'latest',
                    gameType: 'competitive',
                    useEventGameOptions: true,
                    eventGameOptions: { spectators: true, gamePrivate: true }
                });
                await this.lobby.onNewGame(this.socketSpy, {
                    eventId: '7',
                    allowSpectators: false,
                    gamePrivate: false
                });
            });

            it('should use the event options, including allowing spectators', function () {
                const game = Object.values(this.lobby.games)[0];

                expect(game.allowSpectators).toBe(true);
                expect(game.gamePrivate).toBe(true);
            });
        });

        describe('when the game is for an event whose game options leave spectators off', function () {
            beforeEach(async function () {
                this.eventService.getEventById.mockResolvedValue({
                    _id: '7',
                    name: 'Regionals',
                    format: 'joust',
                    variant: 'standard',
                    legality: 'latest',
                    gameType: 'competitive',
                    useEventGameOptions: true,
                    eventGameOptions: { spectators: false }
                });
            });

            it('should let the creator allow spectators', async function () {
                await this.lobby.onNewGame(this.socketSpy, { eventId: '7', allowSpectators: true });

                expect(Object.values(this.lobby.games)[0].allowSpectators).toBe(true);
            });

            it('should let the creator make the game private', async function () {
                this.eventService.getEventById.mockResolvedValue({
                    _id: '7',
                    name: 'Regionals',
                    format: 'joust',
                    variant: 'standard',
                    legality: 'latest',
                    gameType: 'competitive',
                    useEventGameOptions: true,
                    eventGameOptions: { spectators: false, gamePrivate: false }
                });
                await this.lobby.onNewGame(this.socketSpy, { eventId: '7', gamePrivate: true });

                expect(Object.values(this.lobby.games)[0].gamePrivate).toBe(true);
            });

            it('should let the creator turn spectators off', async function () {
                await this.lobby.onNewGame(this.socketSpy, {
                    eventId: '7',
                    allowSpectators: false
                });

                expect(Object.values(this.lobby.games)[0].allowSpectators).toBe(false);
            });
        });

        describe('when the game is for an event with a list of spectators', function () {
            beforeEach(async function () {
                this.eventService.getEventById.mockResolvedValue({
                    _id: '7',
                    name: 'Regionals',
                    format: 'joust',
                    variant: 'standard',
                    legality: 'latest',
                    gameType: 'competitive',
                    useEventGameOptions: true,
                    eventGameOptions: { spectators: false },
                    validSpectators: ['judge1']
                });
                await this.lobby.onNewGame(this.socketSpy, {
                    eventId: '7',
                    allowSpectators: false
                });
            });

            it('should allow spectators so the list decides who can watch', function () {
                expect(Object.values(this.lobby.games)[0].allowSpectators).toBe(true);
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

    describe('onNodeReconnected', function () {
        beforeEach(function () {
            const alice = { username: 'alice', settings: {} };
            const bob = { username: 'bob', settings: {} };
            const game = new Game(
                {
                    id: 'game1',
                    name: 'Private melee',
                    owner: alice,
                    players: {
                        alice: { id: 'p1', user: alice, seatNo: 2 },
                        bob: { id: 'p2', user: bob, seatNo: 1 }
                    },
                    spectators: {},
                    allowSpectators: false,
                    showHand: true,
                    gamePrivate: true,
                    gameFormat: 'melee',
                    gameType: 'casual',
                    maxPlayers: 3,
                    allowMultipleWinners: true,
                    password: 'secret',
                    event: { _id: 'event1', name: 'Winter Cup' },
                    muteSpectators: true,
                    useGameTimeLimit: true,
                    gameTimeLimit: 55,
                    useChessClocks: true,
                    chessClockTimeLimit: 30,
                    chessClockDelay: 5
                },
                { router: {} }
            );
            game.started = true;
            game.startedAt = new Date();

            const syncedGame = game.getSummary(undefined, { fullData: true });
            syncedGame.password = game.password;
            syncedGame.players['alice'].faction = 'stark';
            syncedGame.players['alice'].agendas = ['01027'];

            this.routerSpy.workers = { node1: { identity: 'node1' } };
            this.lobby.onNodeReconnected('node1', [syncedGame]);

            this.summary = this.lobby.games['game1'].getSummary();
        });

        it('should keep the game options', function () {
            expect(this.summary).toEqual(
                expect.objectContaining({
                    name: 'Private melee',
                    started: true,
                    allowSpectators: false,
                    showHand: true,
                    gamePrivate: true,
                    gameFormat: 'melee',
                    gameType: 'casual',
                    maxPlayers: 3,
                    allowMultipleWinners: true,
                    needsPassword: true,
                    event: expect.objectContaining({ name: 'Winter Cup' }),
                    muteSpectators: true,
                    useGameTimeLimit: true,
                    gameTimeLimit: 55,
                    useChessClocks: true,
                    chessClockTimeLimit: 30,
                    chessClockDelay: 5
                })
            );
        });

        it('should keep the seat order', function () {
            expect(this.summary.players['alice'].seatNo).toBe(2);
            expect(this.summary.players['bob'].seatNo).toBe(1);
        });

        it('should keep faction and agendas hidden for a private game', function () {
            expect(this.summary.players['alice'].faction).toBeUndefined();
            expect(this.summary.players['alice'].agendas).toEqual([undefined]);
        });
    });
});
