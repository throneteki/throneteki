const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const Event = require('./event.js');
const Spectator = require('./spectator.js');
const BaseCard = require('./basecard.js');
const GamePipeline = require('./gamepipeline.js');
const SetupPhase = require('./gamesteps/setupphase.js');
const PlotPhase = require('./gamesteps/plotphase.js');
const DrawPhase = require('./gamesteps/drawphase.js');
const MarshalingPhase = require('./gamesteps/marshalingphase.js');
const ChallengePhase = require('./gamesteps/challengephase.js');
const DominancePhase = require('./gamesteps/dominancephase.js');
const StandingPhase = require('./gamesteps/standingphase.js');
const TaxationPhase = require('./gamesteps/taxationphase.js');
const SimpleStep = require('./gamesteps/simplestep.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');

class Game extends EventEmitter {
    constructor(owner, details) {
        super();

        this.players = {};
        this.playerPlots = {};
        this.playerCards = {};
        this.messages = [];

        this.name = details.name;
        this.allowSpectators = details.spectators;
        this.id = uuid.v1();
        this.owner = owner;
        this.started = false;
        this.playStarted = false;

        this.setMaxListeners(0);
    }

    addChatMessage(message) {
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addMessage(message) {
        var args = Array.from(arguments).slice(1);
        var argList = [];

        args = _.reduce(args, (argList, arg) => {
            if(arg instanceof Spectator) {
                argList.push(arg.name);
            } else {
                argList.push(arg);
            }

            return argList;
        }, argList);

        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    formatMessage(format, args) {
        var messageFragments = format.split(/(\{\d+\})/);

        return _.map(messageFragments, fragment => {
            var argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                var arg = args[argMatch[1]];
                if(!_.isUndefined(arg) && !_.isNull(arg)) {
                    if(arg instanceof BaseCard) {
                        return { code: arg.code, label: arg.name, type: arg.getType() };
                    } else if(arg instanceof Spectator) {
                        return { name: arg.user.username, emailHash: arg.user.emailHash };
                    }

                    return arg;
                }

                return '';
            }

            return fragment;
        });
    }

    isSpectator(player) {
        return player.constructor === Spectator;
    }

    getPlayers() {
        var players = {};

        _.reduce(this.players, (playerList, player) => {
            if(!this.isSpectator(player)) {
                playerList[player.name] = player;
            }

            return playerList;
        }, players);

        return players;
    }

    getPlayerByName(playerName) {
        return this.getPlayers()[playerName];
    }

    getPlayersInFirstPlayerOrder() {
        return _.sortBy(this.getPlayers(), player => !player.firstPlayer);
    }

    getPlayersAndSpectators() {
        return this.players;
    }

    getSpectators() {
        var spectators = [];

        _.reduce(this.players, (spectators, player) => {
            if(this.isSpectator(player)) {
                spectators.push(player);
            }

            return spectators;
        }, spectators);

        return spectators;
    }

    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
    }

    getOtherPlayer(player) {
        var otherPlayer = _.find(this.getPlayers(), p => {
            return p.name !== player.name;
        });

        return otherPlayer;
    }

    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    playCard(playerName, cardId, isDrop, sourceList) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        var card = player.findCardByUuid(player.hand, cardId);

        if(card && !isDrop && this.pipeline.handleCardClicked(player, card)) {
            this.pipeline.continue();
            return;
        }

        if(player.activePlot && !player.activePlot.canPlay(player, cardId)) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);
        if(otherPlayer && otherPlayer.activePlot && !otherPlayer.activePlot.canPlay(player, cardId)) {
            return;
        }

        if(!player.playCard(cardId, isDrop, sourceList)) {
            return;
        }

        this.raiseEvent('onCardPlayed', player, cardId);
        this.pipeline.continue();
    }

    processCardClicked(player, cardId) {
        var card = this.findAnyCardInPlayByUuid(cardId);

        if(!card) {
            return false;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return true;
        }

        if(card && card.onClick(player)) {
            return true;
        }

        return false;
    }

    selectPlot(player, plotId) {
        var plot = player.findCardByUuid(player.plotDeck, plotId);

        if(!plot) {
            return;
        }

        player.plotDeck.each(p => {
            p.selected = false;
        });

        plot.selected = true;
    }

    cardClicked(sourcePlayer, source, cardId) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        switch(source) {
            case 'hand':
                this.playCard(player.name, cardId);
                return;
            case 'plot deck':
                this.selectPlot(player, cardId);

                this.pipeline.continue();
                return;
        }

        var handled = this.processCardClicked(player, cardId);

        if(!handled) {
            var cardInPlay = player.findCardInPlayByUuid(cardId);

            if(cardInPlay && !cardInPlay.facedown) {
                cardInPlay.kneeled = !cardInPlay.kneeled;

                this.addMessage('{0} {1} {2}', player, cardInPlay.kneeled ? 'kneels' : 'stands', cardInPlay);
            }
        }

        this.pipeline.continue();
    }

    cardHasMenuItem(card, menuItem) {
        return card.menu && card.menu.any(m => {
            return m.method === menuItem.method;
        });
    }

    callCardMenuCommand(card, player, menuItem) {
        if(!card || !card[menuItem.method] || !this.cardHasMenuItem(card, menuItem)) {
            return;
        }

        card[menuItem.method](player, menuItem.arg);
    }

    menuItemClick(sourcePlayer, source, cardId, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, source, cardId);
            return;
        }

        switch(source) {
            case 'agenda':
                this.callCardMenuCommand(player.agenda, player, menuItem);
                break;
            case 'play area':
                var card = this.findAnyCardInPlayByUuid(cardId);
                if(card.controller !== player && !menuItem.anyPlayer) {
                    return;
                }

                this.callCardMenuCommand(card, player, menuItem);
                break;
        }

        this.pipeline.continue();
    }

    showDrawDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDeck) {
            player.showDrawDeck();

            this.addMessage('{0} is looking at their deck', player);
        } else {
            player.showDeck = false;

            this.addMessage('{0} stops looking at their deck', player);
        }
    }

    drop(playerName, cardId, source, target) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(player.drop(cardId, source, target)) {
            this.addMessage('{0} has moved a card from their {1} to their {2}', player, source, target);
        }
    }

    addPower(player, power) {
        player.faction.power += power;

        if(player.faction.power < 0) {
            player.faction.power = 0;
        }

        this.raiseEvent('onStatChanged', player, 'power');

        this.checkWinCondition(player);
    }

    transferPower(winner, loser, power) {
        var appliedPower = Math.min(loser.faction.power, power);
        loser.faction.power -= appliedPower;
        winner.faction.power += appliedPower;

        this.raiseEvent('onStatChanged', loser, 'power');
        this.raiseEvent('onStatChanged', winner, 'power');

        this.checkWinCondition(winner);
    }

    checkWinCondition(player) {
        if(player.getTotalPower() >= 15) {
            this.addMessage('{0} has won the game', player);
        }
    }

    changeStat(playerName, stat, value) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        var target = player;

        if(stat === 'power') {
            target = player.faction;
        }

        target[stat] += value;

        this.raiseEvent('onStatChanged', player, stat, value);

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    chat(playerName, message) {
        var player = this.players[playerName];
        var args = message.split(' ');
        var num = 1;

        if(!player) {
            return;
        }

        if(this.isSpectator(player)) {
            this.addChatMessage('{0} {1}', player, message);
            return;
        }

        if(message.indexOf('/draw') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

            player.drawCardsToHand(num);

            return;
        }

        if(message.indexOf('/power') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.promptForSelect(player, {
                activePromptTitle: 'Select a card to set power for',
                waitingPromptTitle: 'Waiting for opponent to set power',
                cardCondition: card => card.inPlay && card.controller === player,
                onSelect: (p, card) => {
                    card.power = num;
                    this.addMessage('{0} uses the /power command to set the power of {1} to {2}', p, card, num);
                    return true;
                }
            });
            this.pipeline.continue();

            return;
        }

        if(message.indexOf('/discard') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /discard command to discard {1} cards at random', player, num);

            player.discardAtRandom(num);

            return;
        }

        if(message.indexOf('/pillage') === 0) {
            this.addMessage('{0} uses the /pillage command to discard a card from the top of their draw deck', player);

            player.discardFromDraw(1);

            return;
        }

        if(message.indexOf('/strength') === 0 || message.indexOf('/str') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.promptForSelect(player, {
                activePromptTitle: 'Select a card to set strength for',
                waitingPromptTitle: 'Waiting for opponent to set strength',
                cardCondition: card => card.inPlay && card.controller === player && card.getType() === 'character',
                onSelect: (p, card) => {
                    card.strengthModifier = num - card.cardData.strength;
                    this.addMessage('{0} uses the /strength command to set the strength of {1} to {2}', p, card, num);
                    return true;
                }
            });
            this.pipeline.continue();

            return;
        }

        if(message.indexOf('/cancel-prompt') === 0) {
            this.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
            this.pipeline.cancelStep();
            this.pipeline.continue();
            return;
        }

        this.addChatMessage('{0} {1}', player, message);
    }

    playerLeave(playerName, reason) {
        var player = this.players[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} {1}', player, reason);
    }

    concede(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addMessage('{0} concedes', player);

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage('{0} wins the game', otherPlayer);
        }
    }

    selectDeck(playerName, deck) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        player.selectDeck(deck);
    }

    shuffleDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} shuffles their deck', player);

        player.shuffleDrawDeck();
    }

    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    menuButton(playerName, arg, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, method)) {
            this.pipeline.continue();
            return true;
        }
    }

    initialise() {
        this.playStarted = false;
        this.messages = [];
        _.each(this.getPlayers(), player => {
            player.initialise();
        });
        this.allCards = _(_.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.allCards.toArray());
        }, []));
        this.raiseEvent('onDecksPrepared');
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);
        this.pipeline.continue();
    }

    beginRound() {
        this.queueStep(new PlotPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new MarshalingPhase(this));
        this.queueStep(new ChallengePhase(this));
        this.queueStep(new DominancePhase(this));
        this.queueStep(new StandingPhase(this));
        this.queueStep(new TaxationPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));

        this.raiseEvent('onBeginRound');
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    raiseEvent(eventName, ...params) {
        var event = new Event();

        this.emit(eventName, event, ...params);

        return event;
    }

    takeControl(player, card) {
        var oldController = card.controller;
        var newController = player;

        if(oldController === newController) {
            return;
        }

        oldController.cardsInPlay = oldController.removeCardByUuid(oldController.cardsInPlay, card.uuid);
        newController.cardsInPlay.push(card);
        card.controller = newController;
    }

    reconnect(id, playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = id;

        this.addMessage('{0} has reconnected', player);
    }

    getState(activePlayer) {
        var playerState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer === player.name);
            });

            return {
                id: this.id,
                name: this.name,
                owner: this.owner,
                players: playerState,
                messages: this.messages,
                spectators: _.map(this.getSpectators(), spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started
            };
        }

        return this.getSummary(activePlayer);
    }

    getSummary(activePlayer) {
        var playerSummaries = [];

        _.each(this.getPlayers(), player => {
            var deck = undefined;

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            }

            playerSummaries.push({ id: player.id, name: player.user.username, emailHash: player.user.emailHash, deck: deck, owner: player.owner });
        });

        return {
            allowSpectators: this.allowSpectators,
            id: this.id,
            messages: this.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            started: this.started,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = Game;
