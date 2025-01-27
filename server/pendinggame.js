import uuid from 'uuid';
import _ from 'underscore';
import crypto from 'crypto';
import logger from './log.js';
import GameChat from './game/gamechat.js';

class PendingGame {
    constructor(owner, instance, details) {
        this.owner = owner;
        this.instance = instance;
        this.players = {};
        this.spectators = {};
        this.id = uuid.v1();
        this.name = details.name;
        this.event = details.event || { _id: 'none' };
        this.restrictedList = details.restrictedList;
        this.allowSpectators = details.allowSpectators;
        this.showHand = details.showHand;
        this.gamePrivate = details.gamePrivate;
        this.gameType = details.gameType;
        this.isMelee = details.isMelee;
        this.createdAt = new Date();
        this.gameChat = new GameChat();
        this.useGameTimeLimit = details.useGameTimeLimit;
        this.gameTimeLimit = details.gameTimeLimit;
        this.muteSpectators = details.muteSpectators;
        this.useChessClocks = details.useChessClocks;
        this.chessClockTimeLimit = details.chessClockTimeLimit;
        this.chessClockDelay = details.chessClockDelay;
        this.started = false;
        this.maxPlayers = 2;
    }

    // Getters
    getPlayersAndSpectators() {
        return Object.assign({}, this.players, this.spectators);
    }

    getPlayers() {
        return this.players;
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    getPlayerOrSpectator(playerName) {
        return this.getPlayersAndSpectators()[playerName];
    }

    getPlayerByName(playerName) {
        return this.players[playerName];
    }

    getSaveState() {
        var players = _.map(this.getPlayers(), (player) => {
            return {
                agendas: player.agendas
                    ? player.agendas.map((agenda) => agenda.cardData.name)
                    : undefined,
                faction: player.faction.cardData.name,
                name: player.name
            };
        });

        return {
            gameId: this.id,
            gameType: this.gameType,
            players: players,
            startedAt: this.createdAt
        };
    }

    // Helpers
    setupFaction(player, faction) {
        player.faction = {};
        player.faction.cardData = faction;
        player.faction.cardData.code = faction.value;
        player.faction.cardData.type = 'faction';
        player.faction.cardData.strength = 0;
    }

    setupAgendas(player, agenda, ...additional) {
        if (!agenda) {
            return;
        }

        player.agendas = [agenda, ...additional].map((agenda) => ({ cardData: agenda }));
    }

    // Actions
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    addPlayer(id, user) {
        if (!user) {
            logger.error('Tried to add a player to a game that did not have a user object');
            return;
        }

        this.players[user.username] = {
            id: id,
            name: user.username,
            user: user,
            owner: this.owner.username === user.username
        };
    }

    addSpectator(id, user) {
        this.spectators[user.username] = {
            id: id,
            name: user.username,
            user: user
        };
    }

    newGame(id, user, password, join) {
        if (password) {
            this.password = crypto.createHash('md5').update(password).digest('hex');
        }

        if (join) {
            this.addPlayer(id, user);
        }
    }

    isUserBlocked(user) {
        return _.contains(this.owner.blockList, user.username.toLowerCase());
    }

    join(id, user, password) {
        if (_.size(this.players) === 2 || this.started) {
            return 'Game full';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        this.addMessage('{0} has joined the game', user.username);
        this.addPlayer(id, user);

        if (!this.isOwner(this.owner.username)) {
            let otherPlayer = Object.values(this.players).find(
                (player) => player.name !== this.owner.username
            );

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }
    }

    watch(id, user, password) {
        if (user && user.permissions && user.permissions.canManageGames) {
            this.addSpectator(id, user);
            this.addMessage('{0} has joined the game as a spectator', user.username);

            return;
        }

        if (!this.allowSpectators) {
            return 'Join not permitted';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        //check if the game has an event selected that restricts spectators
        if (this.event && this.event.restrictSpectators && this.event.validSpectators) {
            if (!this.event.validSpectators.includes(user.username.toLowerCase())) {
                return 'You are not a valid spectator for this event';
            }
        }

        this.addSpectator(id, user);
        this.addMessage('{0} has joined the game as a spectator', user.username);
    }

    leave(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has left the game', playerName);
        }

        if (this.players[playerName]) {
            if (this.started) {
                this.players[playerName].left = true;
            } else {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        }

        if (this.spectators[playerName]) {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has disconnected', playerName);
        }

        if (this.players[playerName]) {
            if (!this.started) {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        } else {
            delete this.spectators[playerName];
        }
    }

    chat(playerName, message) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        player.argType = 'player';

        this.addMessage('{0} {1}', player, message);
    }

    selectDeck(playerName, deck) {
        var player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (player.deck) {
            player.deck.selected = false;
        }

        player.deck = deck;
        player.deck.selected = true;

        this.setupFaction(player, deck.faction);
        this.setupAgendas(player, deck.agenda, ...deck.bannerCards);
    }

    // interrogators
    isEmpty() {
        return !_.any(this.getPlayersAndSpectators(), (player) =>
            this.hasActivePlayer(player.name)
        );
    }

    isOwner(playerName) {
        let player = this.players[playerName];

        if (!player || !player.owner) {
            return false;
        }

        return true;
    }

    removeAndResetOwner(playerName) {
        if (this.isOwner(playerName)) {
            let otherPlayer = _.find(this.players, (player) => player.name !== playerName);

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }
    }

    hasActivePlayer(playerName) {
        return (
            (this.players[playerName] &&
                !this.players[playerName].left &&
                !this.players[playerName].disconnected) ||
            this.spectators[playerName]
        );
    }

    isVisibleFor(user) {
        if (!user) {
            return true;
        }

        if (user.permissions && user.permissions.canManageGames) {
            return true;
        }

        let players = Object.values(this.players);
        return (
            !this.owner.hasUserBlocked(user) &&
            !user.hasUserBlocked(this.owner) &&
            players.every((player) => !player.user.hasUserBlocked(user))
        );
    }

    // Summary
    getSummary(activePlayer) {
        var playerSummaries = {};
        var playersInGame = _.filter(this.players, (player) => !player.left);

        _.each(playersInGame, (player) => {
            var deck = undefined;

            if (activePlayer === player.name && player.deck) {
                deck = {
                    name: player.deck.name,
                    selected: player.deck.selected,
                    status: player.deck.status
                };
            } else if (player.deck) {
                deck = { selected: player.deck.selected, status: player.deck.status };
            } else {
                deck = {};
            }

            //the agenda and faction should only be sent to the client if
            //1. the game is NOT private
            //2. the game hasn´t started yet
            //3. agenda and faction are actually not undefined
            let agendas = [undefined];
            if (!this.gamePrivate && this.started && player.agendas) {
                agendas = player.agendas.map((card) => card.cardData.code);
            }
            let faction;
            if (!this.gamePrivate && this.started && player.faction) {
                faction = player.faction.cardData.code;
            }

            playerSummaries[player.name] = {
                agendas: agendas,
                deck: activePlayer ? deck : {},
                faction: faction,
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner,
                role: player.user.role,
                settings: player.user.settings
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            event: this.event,
            full: Object.values(this.players).length >= this.maxPlayers,
            id: this.id,
            messages: activePlayer ? this.gameChat.messages : undefined,
            name: this.name,
            needsPassword: !!this.password,
            node: this.node ? this.node.identity : undefined,
            owner: this.owner.username,
            players: playerSummaries,
            restrictedList: this.restrictedList,
            showHand: this.showHand,
            started: this.started,
            spectators: _.map(this.spectators, (spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name,
                    settings: spectator.settings
                };
            }),
            useGameTimeLimit: this.useGameTimeLimit,
            gameTimeLimit: this.gameTimeLimit,
            muteSpectators: this.muteSpectators,
            useChessClocks: this.useChessClocks,
            chessClockTimeLimit: this.chessClockTimeLimit,
            chessClockDelay: this.chessClockDelay
        };
    }

    getStartGameDetails() {
        const players = {};

        for (let playerDetails of Object.values(this.players)) {
            const { name, user, ...rest } = playerDetails;
            players[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        const spectators = {};
        for (let spectatorDetails of Object.values(this.spectators)) {
            const { name, user, ...rest } = spectatorDetails;
            spectators[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        return {
            instance: this.instance,
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            event: this.event,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.id,
            isMelee: this.isMelee,
            name: this.name,
            owner: this.owner.getDetails(),
            players,
            restrictedList: this.restrictedList,
            showHand: this.showHand,
            spectators,
            useGameTimeLimit: this.useGameTimeLimit,
            gameTimeLimit: this.gameTimeLimit,
            muteSpectators: this.muteSpectators,
            useChessClocks: this.useChessClocks,
            chessClockTimeLimit: this.chessClockTimeLimit,
            chessClockDelay: this.chessClockDelay
        };
    }
}

export default PendingGame;
