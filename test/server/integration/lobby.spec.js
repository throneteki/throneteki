import Lobby from '../../../server/lobby.js';

describe('lobby', function () {
    beforeEach(function () {
        this.socketSpy = jasmine.createSpyObj('socket', ['joinChannel', 'send']);
        this.ioSpy = jasmine.createSpyObj('io', ['set', 'use', 'on', 'emit']);
        this.routerSpy = jasmine.createSpyObj('router', ['on']);
        this.userSpy = jasmine.createSpyObj('User', ['getDetails', 'hasUserBlocked']);
        this.userSpy.username = 'test';
        this.userSpy.getDetails.and.returnValue({ username: 'test' });
        this.userSpy.hasUserBlocked.and.returnValue(false);

        this.socketSpy.user = this.userSpy;
        this.socketSpy.id = 'socket1';

        this.cardService = jasmine.createSpyObj('cardService', [
            'getTitleCards',
            'getAllCards',
            'getRestrictedList'
        ]);
        this.cardService.getTitleCards.and.returnValue(Promise.resolve([]));
        this.cardService.getAllCards.and.returnValue(Promise.resolve([]));
        this.cardService.getRestrictedList.and.returnValue(
            Promise.resolve([{ name: 'Default RL', banned: [], restricted: [] }])
        );

        this.userService = jasmine.createSpyObj('userService', ['on']);

        this.messageService = jasmine.createSpyObj('messageService', ['on']);

        this.eventService = jasmine.createSpyObj('eventService', ['getEventById']);

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
            beforeEach(function (done) {
                this.lobby.onNewGame(this.socketSpy, { eventId: 'none' }).then(() => {
                    done();
                });
            });

            it('should create a new game with the player in it', function () {
                expect(Object.values(this.lobby.games).length).toBe(1);
                var gamesArray = Object.values(this.lobby.games);
                var player = gamesArray[0].players['test'];

                expect(player.name).toBe('test');
            });
        });

        describe('when called twice', function () {
            beforeEach(function (done) {
                this.lobby
                    .onNewGame(this.socketSpy, { eventId: 'none' })
                    .then(() => {
                        return this.lobby.onNewGame(this.socketSpy, { eventId: 'none' });
                    })
                    .then(() => {
                        done();
                    });
            });

            it('should only create 1 game', function () {
                expect(Object.values(this.lobby.games).length).toBe(1);
            });
        });
    });
});
