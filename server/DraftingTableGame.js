const EventEmitter = require('events');
const moment = require('moment');

const AnonymousSpectator = require('./game/anonymousspectator');
const DraftingPlayer = require('./DraftingPlayer');
const DraftCube = require('./DraftCube');
const DraftingTable = require('./DraftingTable');
const GameChat = require('./game/gamechat');
const PlainTextGameChatFormatter = require('./game/PlainTextGameChatFormatter');
const Spectator = require('./game/spectator');

class DraftingTableGame extends EventEmitter {
    constructor(details, options = {}) {
        super();

        const { draftCube, event, owner, players, spectators } = details;
        const { router } = options;

        const playerObjects = Object.values(players || []).map(player => new DraftingPlayer({ id: player.id, name: player.user.username, starterCards: draftCube.starterDeck, user: player.user }));

        this.allowSpectators = details.allowSpectators;
        this.createdAt = new Date();
        this.draftCube = draftCube;
        this.event = event;
        this.eventName = event && event.name;
        this.gameChat = new GameChat();
        this.gameType = details.gameType;
        this.id = details.id;
        this.muteSpectators = details.muteSpectators;
        this.name = details.name;
        this.owner = owner.username;
        this.password = details.password;
        this.playersAndSpectators = {};
        this.restrictedListData = this.restrictedList ? [this.restrictedList] : (options.restrictedListData || []);
        this.router = options.router;
        this.savedGameId = details.savedGameId;
        this.started = false;
        this.restrictedList = details.restrictedList;
        this.cardData = options.cardData || [];

        this.draftingTable = new DraftingTable({
            draftCube: new DraftCube({
                rarities: draftCube.packDefinitions[0].rarities
            }),
            event,
            gameLog: this.gameChat,
            messageBus: this,
            numOfRounds: event.draftOptions.numOfRounds,
            players: playerObjects,
            saveDeck: deck => {
                router.saveDeck(deck);
            }
        });

        for(let player of playerObjects) {
            this.playersAndSpectators[player.name] = player;
        }

        for(let spectator of Object.values(spectators || {})) {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        }

        this.setMaxListeners(0);
    }

    reportError(e) {
        this.router.handleError(this, e);
    }

    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }

    getPlainTextLog() {
        let formatter = new PlainTextGameChatFormatter(this.gameChat);
        return formatter.format();
    }

    getPlayers() {
        return Object.values(this.playersAndSpectators).filter(player => !player.isSpectator());
    }

    getPlayerByName(playerName) {
        let player = this.playersAndSpectators[playerName];

        if(!player || player.isSpectator()) {
            return;
        }

        return player;
    }

    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    getSpectators() {
        return Object.values(this.playersAndSpectators).filter(player => player.isSpectator());
    }

    drop(playerName, cardId, source, target) {
    }

    chat(playerName, message) {
        const player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(!player.isSpectator()) {
            let card = Object.values(this.cardData).find(c => {
                return c.label.toLowerCase() === message.toLowerCase() || c.name.toLowerCase() === message.toLowerCase();
            });

            if(card) {
                this.gameChat.addChatMessage('{0} {1}', player, card);

                return;
            }
        }

        if(!player.isSpectator() || !this.muteSpectators) {
            this.gameChat.addChatMessage('{0} {1}', player, message);
        }
    }

    initialise() {
        this.draftingTable.startRound();
    }

    watch(socketId, user) {
        return false;
    }

    isEmpty() {
        return Object.values(this.playersAndSpectators).every(player => {
            if(player.left || player.id === 'TBA') {
                return true;
            }

            if(!player.disconnectedAt) {
                return false;
            }

            let difference = moment().diff(moment(player.disconnectedAt), 'seconds');

            return difference > 30;
        });
    }

    leave(playerName) {
        let player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addAlert('info', '{0} has left the game', player);

        if(player.isSpectator() || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            this.draftingTable.handleLeftPlayer(playerName);

            if(this.isEmpty()) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addAlert('warning', '{0} has disconnected.  The game will wait up to 30 seconds for them to reconnect', player);

        if(player.isSpectator()) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.disconnectedAt = new Date();
            this.draftingTable.handleDisconnectedPlayer(playerName);
        }

        player.socket = undefined;
    }

    failedConnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player || player.connectionSucceeded) {
            return;
        }

        if(player.isSpectator() || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('danger', '{0} has failed to connect to the game', player);

            player.disconnectedAt = new Date();

            if(this.isEmpty()) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnectedAt = undefined;

        this.addAlert('info', '{0} has reconnected', player);
    }

    chooseCard(playerName, card) {
        this.draftingTable.chooseCard(playerName, card);
    }

    confirmChosenCard(playerName) {
        this.draftingTable.confirmChosenCard(playerName);
        if(this.draftingTable.draftFinished) {
            this.finishedAt = new Date();
        }
    }

    cancelChosenCard(playerName) {
        this.draftingTable.cancelChosenCard(playerName);
    }

    continue() {
    }

    getSaveState() {
        var players = this.getPlayers().map(player => {
            return {
                name: player.name
            };
        });

        return {
            id: this.savedGameId,
            gameId: this.id,
            startedAt: this.startedAt,
            players: players,
            finishedAt: this.finishedAt
        };
    }

    getState(activePlayerName) {
        return {
            id: this.id,
            draftingTable: this.draftingTable.getState(activePlayerName),
            messages: this.gameChat.messages,
            players: this.getPlayers().reduce((data, player) => {
                data[player.name] = player.getConnectionState({});
                return data;
            }, {}),
            spectators: this.getSpectators().map(spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            started: this.started,
            tableType: 'drafting-session'
        };
    }

    getSummary(activePlayerName, { fullData = false }) {
        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            event: this.event,
            gameType: this.gameType,
            id: this.id,
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: this.getPlayers().reduce((data, player) => {
                data[player.name] = player.getConnectionState({ fullData });
                return data;
            }, {}),
            spectators: this.getSpectators().map(spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            started: this.started,
            startedAt: this.startedAt
        };
    }

    toggleMuteSpectators(playerName) {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.chatCommands.muteSpectators(player);
    }
}

module.exports = DraftingTableGame;
