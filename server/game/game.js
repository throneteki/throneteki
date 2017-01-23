const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const GameChat = require('./gamechat.js');
const EffectEngine = require('./effectengine.js');
const Effect = require('./effect.js');
const Spectator = require('./spectator.js');
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
const EventWindow = require('./gamesteps/eventwindow.js');
const GameRepository = require('../repositories/gameRepository.js');

class Game extends EventEmitter {
    constructor(owner, details) {
        super();

        this.effectEngine = new EffectEngine(this);
        this.players = {};
        this.playerPlots = {};
        this.playerCards = {};
        this.gameChat = new GameChat();
        this.pipeline = new GamePipeline();

        this.name = details.name;
        this.allowSpectators = details.spectators;
        this.id = uuid.v1();
        this.owner = owner;
        this.started = false;
        this.playStarted = false;

        this.setMaxListeners(0);

        this.gameRepository = new GameRepository();
    }

    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
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

    findAnyCardInAnyList(cardId) {
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardByUuidInAnyList(cardId);
        }, null);
    }

    addEffect(source, properties) {
        this.effectEngine.add(new Effect(this, source, properties));
    }

    playCard(playerName, cardId, isDrop, sourceList) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        var card = player.findCardByUuid(sourceList, cardId);

        if(card && !isDrop && this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        if(!player.playCard(card, isDrop)) {
            return;
        }

        this.raiseEvent('onCardPlayed', player, card);
    }

    processCardClicked(player, card) {
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

    cardClicked(sourcePlayer, cardId) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        var card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        switch(card.location) {
            case 'hand':
                this.playCard(player.name, cardId, false, player.hand);
                return;
            case 'plot deck':
                this.selectPlot(player, cardId);

                return;
        }

        var handled = this.processCardClicked(player, card);

        if(!handled) {
            if(card && !card.facedown && card.location === 'play area' && card.controller === player) {
                if(card.kneeled) {
                    player.standCard(card);
                } else {
                    player.kneelCard(card);
                }

                this.addMessage('{0} {1} {2}', player, card.kneeled ? 'kneels' : 'stands', card);
            }
        }
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

    menuItemClick(sourcePlayer, cardId, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }

        var card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        switch(card.location) {
            case 'active plot':
                this.callCardMenuCommand(player.activePlot, player, menuItem);
                break;
            case 'agenda':
                this.callCardMenuCommand(player.agenda, player, menuItem);
                break;
            case 'play area':
                if(card.controller !== player && !menuItem.anyPlayer) {
                    return;
                }

                this.callCardMenuCommand(card, player, menuItem);
                break;
        }
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

    addGold(player, gold) {
        player.gold += gold;

        if(player.gold < 0) {
            player.gold = 0;
        }

        this.raiseEvent('onStatChanged', player, 'gold');
    }

    transferPower(winner, loser, power) {
        var appliedPower = Math.min(loser.faction.power, power);
        loser.faction.power -= appliedPower;
        winner.faction.power += appliedPower;

        this.raiseEvent('onStatChanged', loser, 'power');
        this.raiseEvent('onStatChanged', winner, 'power');

        this.checkWinCondition(winner);
    }

    transferGold(to, from, gold) {
        var appliedGold = Math.min(from.gold, gold);

        from.gold -= appliedGold;
        to.gold += appliedGold;

        this.raiseEvent('onStatChanged', from, 'power');
        this.raiseEvent('onStatChanged', to, 'power');        
    }

    checkWinCondition(player) {
        if(player.getTotalPower() >= 15) {
            this.addMessage('{0} has won the game', player);

            if(!this.winner) {
                this.winner = player;
                this.finishedAt = new Date();
                this.winReason = 'power';

                this.saveGame();
            }
        }
    }

    playerDecked(player) {
        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage('{0}\'s draw deck is empty', player);
            this.addMessage('{0} has won the game', otherPlayer);

            if(!this.winner) {
                this.winner = player;
                this.finishedAt = new Date();
                this.winReason = 'decked';

                this.saveGame();
            }            
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
        } else if(stat === 'reserve' || stat === 'claim') {
            if(!player.activePlot) {
                return;
            }
            
            target = player.activePlot.cardData;
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

    isValidIcon(icon) {
        var lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    chat(playerName, message) {
        var player = this.players[playerName];
        var args = message.split(' ');
        var num = 1;

        if(!player) {
            return;
        }

        if(this.isSpectator(player)) {
            this.gameChat.addChatMessage('{0} {1}', player, message);
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
                cardCondition: card => card.location === 'play area' && card.controller === player,
                onSelect: (p, card) => {
                    card.modifyPower(num - card.power);

                    this.addMessage('{0} uses the /power command to set the power of {1} to {2}', p, card, num);
                    return true;
                }
            });

            return;
        }

        if(message.indexOf('/kill') === 0) {
            this.promptForSelect(player, {
                activePromptTitle: 'Select a character',
                waitingPromptTitle: 'Waiting for opponent to kill character',
                cardCondition: card => card.location === 'play area' && card.controller === player,
                onSelect: (p, card) => {
                    card.controller.killCharacter(card);

                    this.addMessage('{0} uses the /kill command to kill {1}', p, card);
                    return true;
                }
            });  

            return;          
        }

        if(message.indexOf('/blank') === 0) {
            this.promptForSelect(player, {
                activePromptTitle: 'Select a card',
                waitingPromptTitle: 'Waiting for opponent to blank card',
                cardCondition: card => card.location === 'play area' && card.controller === player,
                onSelect: (p, card) => {
                    card.setBlank();

                    this.addMessage('{0} uses the /blank command to blank {1}', p, card);
                    return true;
                }
            });  

            return;          
        }

        if(message.indexOf('/unblank') === 0) {
            this.promptForSelect(player, {
                activePromptTitle: 'Select a card',
                waitingPromptTitle: 'Waiting for opponent to unblank card',
                cardCondition: card => card.location === 'play area' && card.controller === player,
                onSelect: (p, card) => {
                    card.clearBlank();

                    this.addMessage('{0} uses the /unblank command to remove the blank condition from {1}', p, card);
                    return true;
                }
            });  

            return;          
        }

        if(message.indexOf('/add-trait') === 0) {
            if(args.length > 1) {
                var trait = args[1];            
                this.promptForSelect(player, {
                    activePromptTitle: 'Select a card',
                    waitingPromptTitle: 'Waiting for opponent to add trait to card',
                    cardCondition: card => card.location === 'play area' && card.controller === player,
                    onSelect: (p, card) => {
                        card.addTrait(trait);

                        this.addMessage('{0} uses the /add-trait command to add the {1} trait to {2}', p, trait, card);
                        return true;
                    }
                });

                return;
            }
        }

        if(message.indexOf('/remove-trait') === 0) {
            if(args.length > 1) {
                trait = args[1];            
                this.promptForSelect(player, {
                    activePromptTitle: 'Select a card',
                    waitingPromptTitle: 'Waiting for opponent to remove trait remove card',
                    cardCondition: card => card.location === 'play area' && card.controller === player,
                    onSelect: (p, card) => {
                        card.removeTrait(trait);

                        this.addMessage('{0} uses the /remove-trait command to remove the {1} trait from {2}', p, trait, card);
                        return true;
                    }
                });

                return;
            }
        }        

        if(message.indexOf('/add-keyword') === 0) {
            if(args.length > 1) {
                var keyword = args[1];            
                this.promptForSelect(player, {
                    activePromptTitle: 'Select a card',
                    waitingPromptTitle: 'Waiting for opponent to add keyword to card',
                    cardCondition: card => card.location === 'play area' && card.controller === player,
                    onSelect: (p, card) => {
                        card.addKeyword(keyword);

                        this.addMessage('{0} uses the /add-keyword command to add the {1} keyword to {2}', p, keyword, card);
                        return true;
                    }
                });

                return;                
            }
        }

        if(message.indexOf('/remove-keyword') === 0) {
            if(args.length > 1) {
                keyword = args[1];            
                this.promptForSelect(player, {
                    activePromptTitle: 'Select a card',
                    waitingPromptTitle: 'Waiting for opponent to add keyword to card',
                    cardCondition: card => card.location === 'play area' && card.controller === player,
                    onSelect: (p, card) => {
                        card.removeKeyword(keyword);

                        this.addMessage('{0} uses the /remove-keyword command to remove the {1} keyword from {2}', p, keyword, card);
                        return true;
                    }
                });

                return;
            }
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
                cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
                onSelect: (p, card) => {
                    card.strengthModifier = num - card.cardData.strength;
                    this.addMessage('{0} uses the /strength command to set the strength of {1} to {2}', p, card, num);
                    return true;
                }
            });

            return;
        }

        if(message.indexOf('/give-icon') === 0) {
            if(args.length > 1 && this.isValidIcon(args[1])) {
                var icon = args[1];

                this.promptForSelect(player, {
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to give icon',
                    cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
                    onSelect: (p, card) => {
                        card.addIcon(icon);
                        this.addMessage('{0} uses the /give-icon command to give {1} a {2} icon', p, card, icon);

                        return true;
                    }
                });

                return;
            }
        }

        if(message.indexOf('/take-icon') === 0) {
            if(args.length > 1 && this.isValidIcon(args[1])) {
                icon = args[1];

                this.promptForSelect(player, {
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to remove icon',
                    cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
                    onSelect: (p, card) => {
                        card.removeIcon(icon);
                        this.addMessage('{0} uses the /take-icon command to remove a {1} icon from {2}', p, icon, card);

                        return true;
                    }
                });

                return;
            }
        }

        if(message.indexOf('/reset-challenges-count') === 0) {
            player.challenges.reset();
            this.addMessage('{0} uses /reset-challenges-count to reset the number of challenges performed', player);
            return;
        }

        if(message.indexOf('/cancel-prompt') === 0) {
            this.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
            this.pipeline.cancelStep();
            return;
        }

        this.gameChat.addChatMessage('{0} {1}', player, message);
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

            if(!this.winner) {
                this.winner = otherPlayer;
                this.finishedAt = new Date();
                this.winReason = 'concede';

                this.saveGame();
            }            
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
            return true;
        }
    }

    initialise() {
        var players = {};

        _.each(this.players, player => {
            if(!player.left) {
                players[player.name] = player;
            }
        });
        
        this.players = players;

        _.each(this.getPlayers(), player => {
            player.initialise();
        });

        this.allCards = _(_.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.allCards.toArray());
        }, []));

        this.raiseEvent('onDecksPrepared');
        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.saveGame();

        this.continue();
    }

    beginRound() {
        this.raiseEvent('onBeginRound');
        this.queueStep(new PlotPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new MarshalingPhase(this));
        this.queueStep(new ChallengePhase(this));
        this.queueStep(new DominancePhase(this));
        this.queueStep(new StandingPhase(this));
        this.queueStep(new TaxationPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    raiseEvent(eventName, ...params) {
        var handler = () => true;

        if(_.isFunction(_.last(params))) {
            handler = params.pop();
        }

        this.queueStep(new EventWindow(this, eventName, params, handler));
    }

    takeControl(player, card) {
        var oldController = card.controller;
        var newController = player;

        if(oldController === newController) {
            return;
        }

        oldController.removeCardFromPile(card);
        newController.cardsInPlay.push(card);

        card.controller = newController;
    }

    reconnect(id, playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = id;
        player.left = false;

        this.addMessage('{0} has reconnected', player);
    }

    continue() {
        this.pipeline.continue();
        this.effectEngine.reapplyStateDependentEffects();
    }

    getSaveState() {
        var players = _.map(this.getPlayers(), player => {
            return { 
                name: player.name,
                faction: player.faction.name,
                agenda: player.agenda ? player.agenda.name : undefined,
                power: player.getTotalPower()
            };
        });

        return {
            id: this.savedGameId,
            startedAt: this.startedAt,
            players: players,
            winner: this.winner ? this.winner.name : undefined,
            winReason: this.winReason,
            finishedAt: this.finishedAt
        };
    }
    
    saveGame() {
        this.gameRepository.save(this.getSaveState(), (err, id) => {
            if(!err) {
                this.savedGameId = id;
            }
        });
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
                messages: this.gameChat.messages,
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
        var playerSummaries = {};

        _.each(this.getPlayers(), player => {
            var deck = undefined;
            if(player.left) {
                return;
            }

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = { 
                agenda: player.agenda ? player.agenda.code : undefined,
                deck: deck, 
                emailHash: player.user.emailHash, 
                faction: player.faction.code,
                id: player.id,
                left: player.left,
                name: player.user.username, 
                owner: player.owner
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            id: this.id,
            messages: this.gameChat.messages,
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
