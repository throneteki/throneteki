const _ = require('underscore');
const EventEmitter = require('events');

const ChatCommands = require('./chatcommands.js');
const GameChat = require('./gamechat.js');
const EffectEngine = require('./effectengine.js');
const Effect = require('./effect.js');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const AnonymousSpectator = require('./anonymousspectator.js');
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
const ChooseOpponentPrompt = require('./gamesteps/chooseopponentprompt.js');
const DeckSearchPrompt = require('./gamesteps/decksearchprompt.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const IconPrompt = require('./gamesteps/iconprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const EventWindow = require('./gamesteps/eventwindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const ForcedTriggeredAbilityWindow = require('./gamesteps/forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindow = require('./gamesteps/triggeredabilitywindow.js');
const KillCharacters = require('./gamesteps/killcharacters.js');
const TitlePool = require('./TitlePool.js');
const Event = require('./event.js');
const AtomicEvent = require('./AtomicEvent.js');
const GroupedCardEvent = require('./GroupedCardEvent.js');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.playerPlots = {};
        this.playerCards = {};
        this.gameChat = new GameChat();
        this.chatCommands = new ChatCommands(this);
        this.pipeline = new GamePipeline();
        this.id = details.id;
        this.name = details.name;
        this.allowSpectators = details.allowSpectators;
        this.owner = details.owner.username;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.savedGameId = details.savedGameId;
        this.gameType = details.gameType;
        this.abilityCardStack = [];
        this.abilityWindowStack = [];
        this.password = details.password;
        this.cancelPromptUsed = false;
        this.claim = {
            isApplying: false,
            type: undefined
        };
        this.isMelee = !!details.isMelee;
        this.noTitleSetAside = !!details.noTitleSetAside;
        this.titlePool = new TitlePool(this, options.titleCardData || []);
        this.shortCardData = options.shortCardData || [];
        this.skipPhase = {};

        _.each(details.players, player => {
            this.playersAndSpectators[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
        });

        _.each(details.spectators, spectator => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.setMaxListeners(0);

        this.router = options.router;

        this.pushAbilityContext('framework', null, 'framework');
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

    isSpectator(player) {
        return player.constructor === Spectator;
    }

    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    getPlayers() {
        return Object.values(this.playersAndSpectators).filter(player => !this.isSpectator(player));
    }

    getPlayerByName(playerName) {
        let player = this.playersAndSpectators[playerName];

        if(!player || this.isSpectator(player)) {
            return;
        }

        return player;
    }

    getPlayersInFirstPlayerOrder() {
        return this.getPlayersInBoardOrder(player => player.firstPlayer);
    }

    getPlayersInBoardOrder(predicate) {
        let players = this.getPlayers();
        let index = players.findIndex(predicate);
        if(index === -1) {
            return players;
        }

        let beforeMatch = players.slice(0, index);
        let matchAndAfter = players.slice(index);

        return matchAndAfter.concat(beforeMatch);
    }

    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    getSpectators() {
        return _.pick(this.playersAndSpectators, player => this.isSpectator(player));
    }

    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
    }

    getOpponents(player) {
        return this.getPlayers().filter(p => p !== player);
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
        return this.allCards.find(card => card.uuid === cardId);
    }

    findAnyCardsInPlay(predicate) {
        var foundCards = [];

        _.each(this.getPlayers(), player => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate));
        });

        return foundCards;
    }

    anyCardsInPlay(predicate) {
        return this.allCards.any(card => card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.allCards.filter(card => card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.allCards.reduce((num, card) => {
            if(card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    anyPlotHasTrait(trait) {
        return _.any(this.getPlayers(), player =>
            player.activePlot &&
            player.activePlot.hasTrait(trait));
    }

    getNumberOfPlotsWithTrait(trait) {
        return _.reduce(this.getPlayers(), (sum, player) => {
            if(player.activePlot && player.activePlot.hasTrait(trait)) {
                return sum + 1;
            }

            return sum;
        }, 0);
    }

    addEffect(source, properties) {
        this.effectEngine.add(new Effect(this, source, properties));
    }

    addSimultaneousEffects(effectProperties) {
        let effects = effectProperties.map(effect => new Effect(this, effect.source, effect.properties));
        this.effectEngine.addSimultaneous(effects);
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

        if(card.location === 'plot deck') {
            this.selectPlot(player, cardId);
            return;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        // Attempt to play cards that are not already in the play area.
        if(['hand', 'discard pile', 'dead pile'].includes(card.location) && player.playCard(card)) {
            return;
        }

        if(card.onClick(player)) {
            return;
        }

        this.defaultCardClick(player, card);
    }

    defaultCardClick(player, card) {
        if(card.facedown || card.controller !== player || !['faction', 'play area'].includes(card.location)) {
            return;
        }

        if(card.kneeled) {
            player.standCard(card);
        } else {
            player.kneelCard(card);
        }

        let standStatus = card.kneeled ? 'kneels' : 'stands';
        let cardFragment = card.getType() === 'faction' ? 'their faction card' : card;

        this.addAlert('danger', '{0} {1} {2}', player, standStatus, cardFragment);
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

            this.addAlert('danger', '{0} is looking at their deck', player);
        } else {
            player.showDeck = false;

            this.addAlert('info', '{0} stops looking at their deck', player);
        }
    }

    drop(playerName, cardId, source, target) {
        let player = this.getPlayerByName(playerName);
        let card = this.findAnyCardInAnyList(cardId);

        if(!player || !card) {
            return;
        }

        if(player.drop(card, source, target)) {
            var movedCard = 'a card';
            if(!_.isEmpty(_.intersection(['dead pile', 'discard pile', 'out of game', 'play area'],
                [source, target]))) {
                // log the moved card only if it moved from/to a public place
                if(this.currentPhase !== 'setup') {
                    movedCard = card;
                }
            }

            this.addAlert('danger', '{0} has moved {1} from their {2} to their {3}',
                player, movedCard, source, target);
        }
    }

    addPower(player, power) {
        player.faction.power += power;

        if(player.faction.power < 0) {
            player.faction.power = 0;
        }

        this.checkWinCondition(player);
    }

    addGold(player, gold) {
        if(gold > 0 && player.cannotGainGold) {
            this.addMessage('{0} cannot gain gold', player);
            return;
        }

        player.gold += gold;

        if(player.gold < 0) {
            player.gold = 0;
        }
    }

    movePower(fromCard, toCard, power) {
        if(power < 1) {
            return;
        }

        this.applyGameAction('movePower', fromCard, fromCard => {
            let appliedPower = Math.min(fromCard.power, power);
            fromCard.power -= appliedPower;
            toCard.power += appliedPower;

            this.raiseEvent('onCardPowerMoved', { source: fromCard, target: toCard, power: appliedPower });

            this.checkWinCondition(toCard.controller);
        });
    }

    transferGold(to, from, gold) {
        var appliedGold = Math.min(from.gold, gold);

        from.gold -= appliedGold;
        to.gold += appliedGold;

        this.raiseEvent('onGoldTransferred', { source: from, target: to, amount: gold });
    }

    checkWinCondition(player) {
        if(player.getTotalPower() >= 15) {
            this.recordWinner(player, 'power');
        }
    }

    playerDecked(player) {
        this.addAlert('info', '{0} loses the game because their draw deck is empty', player);
        player.lost = true;

        let remainingPlayers = this.getPlayers().filter(player => !player.lost);
        if(remainingPlayers.length === 1) {
            this.recordWinner(remainingPlayers[0], 'decked');
        }
    }

    recordWinner(winner, reason) {
        if(this.winner) {
            return;
        }

        this.addAlert('success', '{0} has won the game', winner);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router.gameWon(this, reason, winner);
    }

    changeStat(playerName, stat, value) {
        let player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        let target = player;

        if(stat === 'power') {
            target = player.faction;
        } else if(stat === 'reserve' || stat === 'claim') {
            if(!player.activePlot) {
                return;
            }

            target = player.activePlot.cardData;
        }

        // Ensure that manually setting reserve isn't limited by any min reserve effects
        if(stat === 'reserve') {
            player.minReserve = 0;
        }

        if(stat === 'claim' && _.isNumber(player.activePlot.claimSet)) {
            player.activePlot.claimSet += value;

            if(player.activePlot.claimSet < 0) {
                player.activePlot.claimSet = 0;
            } else {
                this.addAlert('danger', '{0} changes the set claim value to be {1} ({2})', player, player.activePlot.claimSet, (value > 0 ? '+' : '') + value);
            }
            return;
        }

        target[stat] += value;

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addAlert('danger', '{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    chat(playerName, message) {
        var player = this.playersAndSpectators[playerName];
        var args = message.split(' ');

        if(!player) {
            return;
        }

        if(!this.isSpectator(player)) {
            if(this.chatCommands.executeCommand(player, args[0], args)) {
                return;
            }

            let card = _.find(this.shortCardData, c => {
                return c.label.toLowerCase() === message.toLowerCase() || c.name.toLowerCase() === message.toLowerCase();
            });

            if(card) {
                this.gameChat.addChatMessage('{0} {1}', player, card);

                return;
            }
        }

        this.gameChat.addChatMessage('{0} {1}', player, message);
    }

    concede(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addAlert('info', '{0} concedes', player);
        player.lost = true;

        let remainingPlayers = this.getPlayers().filter(player => !player.lost);

        if(remainingPlayers.length === 1) {
            this.recordWinner(remainingPlayers[0], 'concede');
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

        this.addAlert('danger', '{0} shuffles their deck', player);

        player.shuffleDrawDeck();
    }

    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    promptForIcon(player, card, callback = () => true) {
        this.queueStep(new IconPrompt(this, player, card, callback));
    }

    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    promptForDeckSearch(player, properties) {
        this.raiseEvent('onBeforeDeckSearch', { source: properties.source, player: player }, event => {
            this.queueStep(new DeckSearchPrompt(this, event.player, properties));
        });
    }

    promptForOpponentChoice(player, properties) {
        this.queueStep(new ChooseOpponentPrompt(this, player, properties));
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

    togglePromptedActionWindow(playerName, windowName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptedActionWindows[windowName] = toggle;
    }

    toggleTimerSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.timerSettings[settingName] = toggle;
    }

    toggleKeywordSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.keywordSettings[settingName] = toggle;
    }

    initialise() {
        var players = {};

        _.each(this.playersAndSpectators, player => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        _.each(this.getPlayers(), player => {
            player.initialise();
        });

        this.allCards = _(this.gatherAllCards());

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.round = 0;

        this.continue();
    }

    gatherAllCards() {
        let playerCards = _.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []);

        if(this.isMelee) {
            return this.titlePool.cards.concat(playerCards);
        }

        return playerCards;
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

    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    markActionAsTaken(context) {
        if(this.currentActionWindow) {
            this.currentActionWindow.markActionAsTaken();
        } else if(this.currentPhase !== 'marshal') {
            this.addAlert('danger', '{0} uses {1} outside of an action window', context.player, context.source);
        }
    }

    get currentAbilityContext() {
        return _.last(this.abilityCardStack);
    }

    pushAbilityContext(source, card, stage) {
        this.abilityCardStack.push({ source: source, card: card, stage: stage });
    }

    popAbilityContext() {
        this.abilityCardStack.pop();
    }

    resolveAbility(ability, context) {
        this.queueStep(new AbilityResolver(this, ability, context));
    }

    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
        let window = new windowClass(this, { abilityType: properties.abilityType, event: properties.event });
        this.abilityWindowStack.push(window);
        window.emitEvents();
        this.queueStep(window);
        this.queueSimpleStep(() => this.abilityWindowStack.pop());
    }

    registerAbility(ability, event) {
        let windowIndex = _.findLastIndex(this.abilityWindowStack, window => window.canTriggerAbility(ability));

        if(windowIndex === -1) {
            return;
        }

        let window = this.abilityWindowStack[windowIndex];
        if(event) {
            window.registerAbility(ability, event);
        } else {
            window.registerAbilityForEachEvent(ability);
        }
    }

    raiseEvent(eventName, params, handler) {
        if(!handler) {
            handler = () => true;
        }
        let event = new Event(eventName, params, handler);

        this.queueStep(new EventWindow(this, event));
    }

    /**
     * Raises multiple events whose resolution is performed atomically. Any
     * abilities triggered by these events will appear within the same prompt
     * for the player.
     */
    raiseAtomicEvent(events) {
        let event = new AtomicEvent();
        for(let childEventProperties of events) {
            let childEvent = new Event(childEventProperties.name, childEventProperties.params, childEventProperties.handler);
            event.addChildEvent(childEvent);
        }
        this.queueStep(new EventWindow(this, event));
    }

    /**
     * Raises the same event across multiple cards as well as a wrapping plural
     * version of the event that lists all cards.
     */
    raiseSimultaneousEvent(cards, properties) {
        let event = new GroupedCardEvent(properties.eventName, _.extend({ cards: cards }, properties.params), properties.handler, properties.postHandler);
        for(let card of cards) {
            let perCardParams = _.extend({ card: card }, properties.params);
            let childEvent = new Event(properties.perCardEventName, perCardParams, properties.perCardHandler);
            event.addChildEvent(childEvent);
        }

        this.queueStep(new EventWindow(this, event));
    }

    isPhaseSkipped(name) {
        return !!this.skipPhase[name];
    }

    saveWithDupe(card) {
        let player = card.controller;
        let dupe = card.dupes.find(dupe => dupe.owner === card.controller);
        if(card.canBeSaved() && dupe) {
            dupe.owner.discardCard(dupe, false);
            card.markAsSaved();
            this.addMessage('{0} discards a duplicate to save {1}', player, card);
            this.raiseEvent('onCardSaved', { card: card });
            return true;
        }

        return false;
    }

    killCharacters(cards, options = {}) {
        options = Object.assign({ allowSave: true, isBurn: false }, options);
        this.queueStep(new KillCharacters(this, cards, options));
    }

    killCharacter(card, options = {}) {
        this.killCharacters([card], options);
    }

    placeOnBottomOfDeck(card, options = { allowSave: true }) {
        this.applyGameAction('placeOnBottomOfDeck', card, card => {
            card.owner.moveCard(card, 'draw deck', { allowSave: options.allowSave, bottom: true });
        });
    }

    takeControl(player, card) {
        var oldController = card.controller;
        var newController = player;

        if(oldController === newController) {
            return;
        }

        if(card.location !== 'play area' && !newController.canPutIntoPlay(card)) {
            return;
        }

        if(card.location === 'play area' && !newController.canControl(card)) {
            return;
        }

        this.applyGameAction('takeControl', card, card => {
            oldController.removeCardFromPile(card);
            card.controller = newController;
            newController.cardsInPlay.push(card);

            if(card.location !== 'play area') {
                let originalLocation = card.location;
                card.moveTo('play area');
                card.applyPersistentEffects();
                this.raiseEvent('onCardEntersPlay', { card: card, playingType: 'play', originalLocation: originalLocation });
            }

            this.raiseEvent('onCardTakenControl', { card: card });
        });
    }

    applyGameAction(actionType, cards, func) {
        let wasArray = _.isArray(cards);
        if(!wasArray) {
            cards = [cards];
        }
        let [allowed, disallowed] = _.partition(cards, card => card.allowGameAction(actionType));

        if(!_.isEmpty(disallowed)) {
            // TODO: add a cannot / immunity message.
        }

        if(_.isEmpty(allowed)) {
            return;
        }

        if(wasArray) {
            func(allowed);
        } else {
            func(allowed[0]);
        }
    }

    watch(socketId, user) {
        if(!this.allowSpectators) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.addAlert('info', '{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId, user) {
        if(this.started || _.values(this.getPlayers()).length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(socketId, user, this.owner === user.username, this);

        return true;
    }

    isEmpty() {
        return _.all(this.playersAndSpectators, player => player.disconnected || player.left || player.id === 'TBA');
    }

    leave(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addAlert('info', '{0} has left the game', player);

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addAlert('warning', '{0} has disconnected', player);

        if(this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.disconnected = true;
        }

        player.socket = undefined;
    }

    failedConnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('danger', '{0} has failed to connect to the game', player);

            player.disconnected = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnected = false;

        this.addAlert('info', '{0} has reconnected', player);
    }

    activatePersistentEffects() {
        this.effectEngine.activatePersistentEffects();
    }

    reapplyStateDependentEffects() {
        this.effectEngine.reapplyStateDependentEffects();
    }

    continue() {
        this.effectEngine.reapplyStateDependentEffects();
        this.pipeline.continue();
        this.effectEngine.reapplyStateDependentEffects();
        // Ensure any events generated by the effects engine are resolved.
        this.pipeline.continue();
    }

    getGameElementType() {
        return 'game';
    }

    getSaveState() {
        var players = _.map(this.getPlayers(), player => {
            return {
                name: player.name,
                faction: player.faction.name || player.faction.value,
                agenda: player.agenda ? player.agenda.name : undefined,
                power: player.getTotalPower()
            };
        });

        return {
            id: this.savedGameId,
            gameId: this.id,
            startedAt: this.startedAt,
            players: players,
            winner: this.winner ? this.winner.name : undefined,
            winReason: this.winReason,
            finishedAt: this.finishedAt
        };
    }

    getState(activePlayerName) {
        let activePlayer = this.playersAndSpectators[activePlayerName] || new AnonymousSpectator();
        let playerState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer);
            });

            return {
                id: this.id,
                isMelee: this.isMelee,
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
                started: this.started,
                winner: this.winner ? this.winner.name : undefined,
                cancelPromptUsed: this.cancelPromptUsed
            };
        }

        return this.getSummary(activePlayerName);
    }

    getSummary(activePlayerName) {
        var playerSummaries = {};

        _.each(this.getPlayers(), player => {
            var deck = undefined;
            if(player.left) {
                return;
            }

            if(activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                agenda: player.agenda ? player.agenda.code : undefined,
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.code,
                id: player.id,
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            isMelee: this.isMelee,
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            started: this.started,
            startedAt: this.startedAt,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = Game;
