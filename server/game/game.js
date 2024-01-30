const EventEmitter = require('events');
const moment = require('moment');

const AttachmentValidityCheck = require('./AttachmentValidityCheck.js');
const ChatCommands = require('./chatcommands.js');
const GameChat = require('./gamechat.js');
const DynamicKeywordsEffect = require('./DynamicKeywordsEffect');
const EffectEngine = require('./effectengine.js');
const Effect = require('./effect.js');
const Effects = require('./effects');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const AnonymousSpectator = require('./anonymousspectator.js');
const GamePipeline = require('./gamepipeline.js');
const Phases = require('./gamesteps/Phases');
const SimpleStep = require('./gamesteps/simplestep.js');
const ChoosePlayerPrompt = require('./gamesteps/ChoosePlayerPrompt');
const CardNamePrompt = require('./gamesteps/CardNamePrompt');
const DeckSearchPrompt = require('./gamesteps/DeckSearchPrompt');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const IconPrompt = require('./gamesteps/iconprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const EventWindow = require('./gamesteps/eventwindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const ForcedTriggeredAbilityWindow = require('./gamesteps/ForcedTriggeredAbilityWindow.js');
const TriggeredAbilityWindow = require('./gamesteps/TriggeredAbilityWindow.js');
const InterruptWindow = require('./gamesteps/InterruptWindow');
const KillCharacters = require('./gamesteps/killcharacters.js');
const TitlePool = require('./TitlePool.js');
const Event = require('./event.js');
const NullEvent = require('./NullEvent');
const AtomicEvent = require('./AtomicEvent.js');
const GroupedCardEvent = require('./GroupedCardEvent.js');
const SimultaneousEvents = require('./SimultaneousEvents');
const ChooseGoldSourceAmounts = require('./gamesteps/ChooseGoldSourceAmounts.js');
const DropCommand = require('./ServerCommands/DropCommand');
const CardVisibility = require('./CardVisibility');
const PlainTextGameChatFormatter = require('./PlainTextGameChatFormatter');
const GameActions = require('./GameActions');
const EndRound = require('./GameActions/EndRound');
const TimeLimit = require('./timeLimit.js');
const PrizedKeywordListener = require('./PrizedKeywordListener');
const GameWonPrompt = require('./gamesteps/GameWonPrompt');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.instance = details.instance;
        this.event = details.event;
        this.eventName = details.event && details.event.name;
        this.restrictedList = details.restrictedList;
        this.allCards = [];
        this.attachmentValidityCheck = new AttachmentValidityCheck(this);
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
        this.showHand = details.showHand;
        this.useRookery = details.useRookery;
        this.owner = details.owner.username;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.useGameTimeLimit = details.useGameTimeLimit;
        this.gameTimeLimit = details.gameTimeLimit;
        this.useChessClocks = details.useChessClocks;
        this.chessClockTimeLimit = details.chessClockTimeLimit;
        this.delayToStartClock = details.delayToStartClock;
        this.clockPaused = false;
        this.timeLimit = new TimeLimit(this);
        this.savedGameId = details.savedGameId;
        this.gamePrivate = details.gamePrivate;
        this.gameType = details.gameType;
        this.abilityContextStack = [];
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
        this.cardData = options.cardData || [];
        this.packData = options.packData || [];
        this.restrictedListData = this.restrictedList ? [this.restrictedList] : (options.restrictedListData || []);
        this.remainingPhases = [];
        this.skipPhase = {};
        this.cardVisibility = new CardVisibility(this);
        this.winnerOfDominanceInLastRound = undefined;
        this.prizedKeywordListener = new PrizedKeywordListener(this);
        this.muteSpectators = details.muteSpectators;

        for(let player of Object.values(details.players || {})) {
            this.playersAndSpectators[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
        }

        for(let spectator of Object.values(details.spectators || {})) {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        }

        this.setMaxListeners(0);

        this.router = options.router;

        this.pushAbilityContext({ resolutionStage: 'framework' });
    }

    isPlaytesting() {
        return this.instance && this.instance.type === 'playtesting';
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

    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    getAllPlayers() {
        return Object.values(this.playersAndSpectators).filter(player => !player.isSpectator());
    }

    getPlayers() {
        return this.getAllPlayers().filter(player => !player.eliminated);
    }

    getNumberOfPlayers() {
        return this.getPlayers().length;
    }

    getPlayerByName(playerName) {
        let player = this.playersAndSpectators[playerName];

        if(!player || player.isSpectator()) {
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
        return Object.values(this.playersAndSpectators).filter(player => player.isSpectator());
    }

    getFirstPlayer() {
        return this.getPlayers().find(p => {
            return p.firstPlayer;
        });
    }

    setFirstPlayer(firstPlayer) {
        for(let player of this.getAllPlayers()) {
            player.firstPlayer = player === firstPlayer;
        }
        this.raiseEvent('onFirstPlayerDetermined', { player: firstPlayer });
    }

    getOpponents(player) {
        return this.getPlayers().filter(p => p !== player);
    }

    getOpponentsInFirstPlayerOrder(player) {
        return this.getPlayersInFirstPlayerOrder().filter(p => p !== player);
    }

    isCardVisible(card, player) {
        return this.cardVisibility.isVisible(card, player);
    }

    anyCardsInPlay(predicate) {
        return this.allCards.some(card => card.location === 'play area' && predicate(card));
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
        return this.getPlayers().some(player =>
            player.activePlot &&
            player.activePlot.hasTrait(trait));
    }

    //during the interrupt window for when plots get revealed
    //the active plot is not yet revealed and the previous plot
    //needs to be considered "in play"
    //the previous plot is always at player.plotDiscard[player.plotDiscard.length - 1]
    //due to it being pushed to the plotDiscard array during plot revelation
    anyPlotHasTraitDuringPlotInterrupt(trait) {
        return this.getPlayers().some(player =>
            player.plotDiscard &&
            player.plotDiscard[player.plotDiscard.length - 1] &&
            player.plotDiscard[player.plotDiscard.length - 1].hasTrait(trait));
    }

    getNumberOfPlotsWithTrait(trait) {
        return this.getPlayers().reduce((sum, player) => {
            if(player.activePlot && player.activePlot.hasTrait(trait)) {
                return sum + 1;
            }

            return sum;
        }, 0);
    }

    isDuringChallenge(matchers = {}) {
        return this.currentChallenge && this.currentChallenge.isMatch(matchers);
    }

    addEffect(source, properties) {
        this.addSimultaneousEffects([{ source: source, properties: properties }]);
    }

    addSimultaneousEffects(effectProperties) {
        let effects = effectProperties.reduce((array, effect) => {
            let flattenedProperties = Effect.flattenProperties(effect.properties);
            let effects = flattenedProperties.map(props => new Effect(this, effect.source, props));
            return array.concat(effects);
        }, []);
        this.effectEngine.addSimultaneous(effects);
    }

    selectPlot(player, plot) {
        for(const p of player.plotDeck) {
            p.selected = false;
        }

        plot.selected = true;
    }

    cardClicked(sourcePlayer, cardId) {
        let player = this.getPlayerByName(sourcePlayer);
        let card = this.allCards.find(card => card.uuid === cardId);

        if(!player || !card) {
            return;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        if(card.location === 'plot deck') {
            this.selectPlot(player, card);
            return;
        }

        if(player.playCard(card)) {
            return;
        }

        if(card.onClick(player)) {
            return;
        }

        this.defaultCardClick(player, card);
    }

    defaultCardClick(player, card) {
        if(card.facedown || card.controller !== player) {
            return;
        }

        let action = card.kneeled ?
            GameActions.standCard({ card, force: true }) :
            GameActions.kneelCard({ card, force: true });

        this.resolveGameAction(action).thenExecute(() => {
            let standStatus = card.kneeled ? 'kneels' : 'stands';
            let cardFragment = card.getType() === 'faction' ? 'their faction card' : card;

            this.addAlert('danger', '{0} {1} {2}', player, standStatus, cardFragment);
        });
    }

    cardHasMenuItem(card, player, menuItem) {
        let menu = card.getMenu(player) || [];
        return menu.some(m => {
            return m.method === menuItem.method;
        });
    }

    callCardMenuCommand(card, player, menuItem) {
        if(!card || !card[menuItem.method] || !this.cardHasMenuItem(card, player, menuItem)) {
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

        let card = this.allCards.find(card => card.uuid === cardId);

        if(!card) {
            return;
        }

        switch(card.location) {
            case 'active plot':
                this.callCardMenuCommand(player.activePlot, player, menuItem);
                break;
            //agenda and play area can behave the same now as the alliance agenda allows you to have more than one agenda card that are clickable
            case 'agenda':
            case 'play area':
                if(card.controller !== player && !menuItem.anyPlayer) {
                    return;
                }

                this.callCardMenuCommand(card, player, menuItem);
                break;
        }
    }

    showDrawDeck(playerName, newValue) {
        let player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(newValue === null || newValue === undefined) {
            newValue = !player.showDeck;
        }

        if(player.showDeck ^ newValue) {
            player.setDrawDeckVisibility(newValue);

            if(newValue) {
                this.addAlert('danger', '{0} is looking at their deck', player);
            } else {
                this.addAlert('info', '{0} stops looking at their deck', player);
            }
        }
    }

    drop(playerName, cardId, source, target) {
        let player = this.getPlayerByName(playerName);
        let card = this.allCards.find(card => card.uuid === cardId);

        if(!player || !card) {
            return;
        }

        let command = new DropCommand(this, player, card, target);
        command.execute();
    }

    addPower(player, power) {
        if(!player.faction.allowGameAction('gainPower')) {
            this.addMessage('{0} is unable to gain power for their faction', player);
            return;
        }

        player.faction.modifyPower(power);
    }

    addGold(player, amount) {
        if(amount <= 0) { // negative should never happen; nothing to do for 0
            return 0;
        }
        if(!player.canGainGold()) {
            this.addMessage('{0} cannot gain gold', player);
            return 0;
        }

        const event = this.resolveGameAction(GameActions.gainGold({ player, amount }));
        return event.amount;
    }

    movePower(fromCard, toCard, power) {
        return this.resolveGameAction(
            GameActions.movePower({ from: fromCard, to: toCard, amount: power })
        );
    }

    /**
     * Spends a specified amount of gold for a player. "Spend" refers to any
     * usage of gold that returns gold to the treasury as part of an ability
     * cost, or gold that has been moved from a player's gold pool to a card.
     *
     * @param {Object} spendParams
     * @param {number} spendParams.amount
     * The amount of gold being spent
     * @param {Player} spendParams.player
     * The player whose gold is being spent
     * @param {string} spendParams.playingType
     * The type of usage for the gold (e.g. 'marshal', 'ambush', 'ability', etc)
     * @param {Function} callback
     * Optional callback that will be called after the gold has been spent
     */
    spendGold(spendParams, callback = () => true) {
        let activePlayer = spendParams.activePlayer || this.currentAbilityContext && this.currentAbilityContext.player;
        spendParams = Object.assign({ playingType: 'ability', activePlayer: activePlayer }, spendParams);

        this.queueStep(new ChooseGoldSourceAmounts(this, spendParams, callback));
    }

    /**
     * Transfers gold from one gold source to another. Both the source and the
     * target for the transfer can be either a card or a player.
     *
     * @param {Object} transferParams
     * @param {number} transferParams.amount
     * The amount of gold being moved
     * @param {(BaseCard|Player)} transferParams.from
     * The source object from which gold is being moved
     * @param {(BaseCard|Player)} transferParams.to
     * The target object to which gold is being moved
     */
    transferGold(transferParams) {
        let { from, to, amount } = transferParams;
        let appliedGold = Math.min(from.gold, amount);

        if(from.getGameElementType() === 'player') {
            let activePlayer = transferParams.activePlayer || this.currentAbilityContext && this.currentAbilityContext.player;
            appliedGold = Math.min(from.getSpendableGold({ player: from, activePlayer: activePlayer }), amount);
            this.spendGold({ amount: appliedGold, player: from, activePlayer: activePlayer }, () => {
                to.modifyGold(appliedGold);
                this.raiseEvent('onGoldTransferred', { source: from, target: to, amount: appliedGold });
            });
            return;
        }

        from.modifyGold(-appliedGold);
        to.modifyGold(appliedGold);

        this.raiseEvent('onGoldTransferred', { source: from, target: to, amount: appliedGold });
    }

    /**
     * Returns the specified amount of gold from a player to the treasury.
     *
     * @param {Object} params
     * @param {Player} params.player The player whose gold pool will be deducted
     * @param {number} params.amount The amount of gold being returned
     */
    returnGoldToTreasury(params) {
        let { player, amount } = params;
        let appliedAmount = Math.min(player.gold, amount);

        player.modifyGold(-appliedAmount);
    }

    checkWinAndLossConditions() {
        if(this.currentPhase === 'setup' || this.winner) {
            return;
        }

        let players = this.getPlayersInFirstPlayerOrder();

        if(players.length === 0) {
            return;
        }

        let deckedPlayers = players.filter(player => player.drawDeck.length === 0);

        if(deckedPlayers.length === players.length) {
            const potentialWinners = deckedPlayers.filter(player => player.canWinGame());
            if(potentialWinners.length === 0) {
                this.recordDraw(deckedPlayers);
            } else if(potentialWinners.length === 1) {
                this.recordWinner(potentialWinners[0], 'decked');
            } else if(!this.disableWonPrompt) {
                this.addAlert('info', '{0} will be eliminated because their draw decks are empty. {1} chooses the winner because they are first player', deckedPlayers, players[0]);
                this.queueStep(new ChoosePlayerPrompt(this, players[0], {
                    activePromptTitle: 'Select the winning player',
                    condition: player => potentialWinners.includes(player),
                    onSelect: chosenPlayer => {
                        this.addAlert('info', '{0} chooses {1} to win the game', players[0], chosenPlayer);
                        this.recordWinner(chosenPlayer, 'decked');
                    }
                }));
            }
            return;
        }

        for(let player of deckedPlayers) {
            this.addAlert('info', '{0} is eliminated from the game because their draw deck is empty', player);
            player.eliminated = true;
        }

        let remainingPlayers = players.filter(player => !player.eliminated);

        // If the first player is eliminated, the next non-eliminated player in order becomes first player
        if(players[0].eliminated && remainingPlayers.length > 1) {
            this.setFirstPlayer(remainingPlayers[0]);
        }

        if(remainingPlayers.length === 1) {
            let lastPlayer = remainingPlayers[0];

            if(lastPlayer.canWinGame()) {
                this.recordWinner(lastPlayer, 'decked');
            } else {
                this.recordDraw(lastPlayer);
            }
        }

        let potentialWinners = remainingPlayers.filter(player => player.getTotalPower() >= 15 && player.canWinGame());
        if(potentialWinners.length === 1) {
            this.recordWinner(potentialWinners[0], 'power');
        } else if(potentialWinners.length > 1) {
            const firstPlayer = this.getFirstPlayer();
            this.addAlert('info', '{0} have reached 15 power. {1} chooses the winner because they are first player', potentialWinners, firstPlayer);
            this.queueStep(new ChoosePlayerPrompt(this, firstPlayer, {
                activePromptTitle: 'Select the winning player',
                condition: player => potentialWinners.includes(player),
                onSelect: chosenPlayer => {
                    this.addAlert('info', '{0} chooses {1} to win the game', firstPlayer, chosenPlayer);
                    this.recordWinner(chosenPlayer, 'power');
                }
            }));
        }
    }

    recordDraw(lastPlayer) {
        if(this.winner) {
            return;
        }

        this.addAlert('info', 'The game ends in a draw because {0} cannot win the game', lastPlayer);
        this.winner = { name: 'DRAW' };
        this.finishedAt = new Date();
        this.winReason = 'draw';

        this.router.gameWon(this, this.winReason, this.winner);
        for(const player of this.getAllPlayers()) {
            player.eliminated = false;
        }
        this.queueStep(new GameWonPrompt(this, null));
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
        for(const player of this.getAllPlayers()) {
            player.eliminated = false;
        }
        this.queueStep(new GameWonPrompt(this, winner));
    }

    changeStat(playerName, stat, value) {
        let player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        let target = player;

        if(stat === 'power') {
            target = player.faction;
        } else if(stat === 'reserve' || stat === 'claim' || stat === 'initiative') {
            if(!player.activePlot) {
                return;
            }

            target = player.activePlot;

            let effect;
            let valueGetter;
            switch(stat) {
                case 'claim':
                    if(typeof (player.activePlot.claimSet) === 'number') {
                        effect = Effects.setClaim(Math.max(player.getClaim() + value, 0));
                    } else {
                        effect = Effects.modifyClaim(value);
                    }
                    valueGetter = () => player.getClaim();
                    break;
                case 'initiative':
                    effect = Effects.modifyInitiative(value);
                    valueGetter = () => player.getTotalInitiative();
                    break;
                case 'reserve':
                    effect = Effects.modifyReserve(value);
                    valueGetter = () => player.getTotalReserve();
                    break;
            }

            if(valueGetter() <= 0 && value < 0) {
                return;
            }

            target.lastingEffect(() => ({
                condition: () => target.location === 'active plot',
                match: target,
                effect: effect
            }));
            this.postEventCalculations();
            this.addAlert('danger', '{0} sets {1} to {2} ({3})', player, stat, valueGetter(), (value > 0 ? '+' : '') + value);
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

        if(!player.isSpectator()) {
            if(this.chatCommands.executeCommand(player, args[0], args)) {
                return;
            }

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

    concede(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addAlert('info', '{0} concedes', player);
        player.eliminated = true;

        let remainingPlayers = this.getPlayers().filter(player => !player.eliminated);

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

    promptForCardName(properties) {
        this.queueStep(new CardNamePrompt(this, properties));
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

    promptForOpponentChoice(player, { condition = () => true, context, enabled, onSelect, onCancel }) {
        let finalCondition = (opponent, context) => opponent !== player && condition(opponent, context);

        this.queueStep(new ChoosePlayerPrompt(this, player, {
            context,
            enabled,
            onSelect,
            onCancel,
            condition: finalCondition,
            activePromptTitle: 'Select an opponent',
            waitingPromptTitle: 'Waiting for player to select an opponent'
        }));
    }

    menuButton(playerName, arg, method, promptId) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, method, promptId)) {
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

    toggleDupes(playerName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptDupes = toggle;
    }

    initialise() {
        var players = {};

        for(let player of Object.values(this.playersAndSpectators)) {
            if(!player.left) {
                players[player.name] = player;
            }
        }

        this.playersAndSpectators = players;

        if(this.useGameTimeLimit) {
            let timeLimitStartType = 'whenSetupFinished'; //todo: change to property of game when more kinds of time limit start triggers are implemented/asked for
            let timeLimitInMinutes = this.gameTimeLimit;
            this.timeLimit.initialiseTimeLimit(timeLimitStartType, timeLimitInMinutes);
        }

        for(let player of this.getPlayers()) {
            player.initialise();
        }

        this.pipeline.initialise([
            Phases.createStep('setup', this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.round = 0;

        this.continue();
    }

    gatherAllCards() {
        let playerCards = this.getPlayers().reduce((cards, player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []);

        if(this.isMelee) {
            this.allCards = this.titlePool.cards.concat(playerCards);
        } else {
            this.allCards = playerCards;
        }
    }

    checkForTimeExpired() {
        if(this.timeLimit.isTimeLimitReached && !this.finishedAt) {
            this.determineWinnerAfterTimeLimitExpired();
        }
    }

    beginRound() {
        // Reset phases to the standard game flow.
        this.remainingPhases = Phases.names();

        this.raiseEvent('onBeginRound');
        this.queueSimpleStep(() => {
            // Loop through individual phases, queuing them one at a time. This
            // will allow additional phases to be added.
            if(this.remainingPhases.length !== 0) {
                let phase = this.remainingPhases.shift();
                this.queueStep(Phases.createStep(phase, this));
                return false;
            }
        });
        this.queueStep(new SimpleStep(this, () => this.resolveGameAction(EndRound, { game: this })));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    addPhase(phase) {
        this.remainingPhases.unshift(phase);
    }

    addPhaseAfter(phase, after) {
        if(this.currentPhase === after) {
            this.addPhase(phase);
        } else {
            this.remainingPhases.splice(this.remainingPhases.indexOf(after), 0, phase);
        }
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    markActionAsTaken(context) {
        if(this.currentActionWindow) {
            if(this.currentActionWindow.currentPlayer !== context.player) {
                this.addAlert('danger', '{0} uses {1} during {2}\'s turn in the action window', context.player, context.hideSourceInMessage ? 'a card' : context.source, this.currentActionWindow.currentPlayer);
            }
            this.currentActionWindow.markActionAsTaken(context.player);
        } else if(this.currentPhase !== 'marshal' || this.hasOpenInterruptOrReactionWindow()) {
            this.addAlert('danger', '{0} uses {1} outside of an action window', context.player, context.hideSourceInMessage ? 'a card' : context.source);
        }
    }

    get currentAbilityContext() {
        if(this.abilityContextStack.length === 0) {
            return null;
        }

        return this.abilityContextStack[this.abilityContextStack.length - 1];
    }

    pushAbilityContext(context) {
        this.abilityContextStack.push(context);
    }

    popAbilityContext() {
        this.abilityContextStack.pop();
    }

    resolveAbility(ability, context) {
        this.queueStep(new AbilityResolver(this, ability, context));
    }

    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
        let window = new windowClass(this, { abilityType: properties.abilityType, event: properties.event });
        this.abilityWindowStack.push(window);
        this.queueStep(window);
        this.queueSimpleStep(() => this.abilityWindowStack.pop());
    }

    openInterruptWindowForAttachedEvents(event) {
        let attachedEvents = [];
        for(let concurrentEvent of event.getConcurrentEvents()) {
            attachedEvents = attachedEvents.concat(concurrentEvent.attachedEvents);
            concurrentEvent.clearAttachedEvents();
        }

        if(attachedEvents.length === 0) {
            return;
        }

        let groupedEvent = new SimultaneousEvents();
        for(let attachedEvent of attachedEvents) {
            groupedEvent.addChildEvent(attachedEvent);
        }

        this.queueStep(new InterruptWindow(this, groupedEvent, () => this.postEventCalculations()));
    }

    registerAbility(ability, event) {
        let reverseStack = [...this.abilityWindowStack].reverse();
        let window = reverseStack.find(window => window.canTriggerAbility(ability));

        if(!window) {
            return;
        }

        window.registerAbility(ability, event);
    }

    clearAbilityResolution(ability) {
        for(let window of this.abilityWindowStack) {
            window.clearAbilityResolution(ability);
        }
    }

    hasOpenInterruptOrReactionWindow() {
        return this.abilityWindowStack.length !== 0;
    }

    raiseEvent(eventName, params, handler) {
        if(!handler) {
            handler = () => true;
        }
        let event = new Event(eventName, params, handler);

        this.queueStep(new EventWindow(this, event, () => this.postEventCalculations()));
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
        this.queueStep(new EventWindow(this, event, () => this.postEventCalculations()));
    }

    /**
     * Raises the same event across multiple cards as well as a wrapping plural
     * version of the event that lists all cards.
     */
    raiseSimultaneousEvent(cards, properties) {
        let event = new GroupedCardEvent(properties.eventName, Object.assign({ cards: cards }, properties.params), properties.handler, properties.postHandler);
        for(let card of cards) {
            let perCardParams = Object.assign({ card: card }, properties.params);
            let childEvent = new Event(properties.perCardEventName, perCardParams, properties.perCardHandler);
            event.addChildEvent(childEvent);
        }

        this.queueStep(new EventWindow(this, event, () => this.postEventCalculations()));
    }

    resolveEvent(event) {
        this.queueStep(new EventWindow(this, event, () => this.postEventCalculations()));
    }

    resolveGameAction(action, props) {
        if(!action.allow(props)) {
            return new NullEvent();
        }

        let event = action.createEvent(props);
        this.resolveEvent(event);
        return event;
    }

    /**
     * Function that executes after the handler for each Event has executed. In
     * terms of overall engine it is useful for things that require regular
     * checks, such as state dependent effects, attachment validity, and others.
     */
    postEventCalculations() {
        this.effectEngine.recalculateDirtyTargets();
        this.effectEngine.reapplyStateDependentEffects();
        this.attachmentValidityCheck.enforceValidity();
        this.checkWinAndLossConditions();
    }

    isPhaseSkipped(name) {
        return !!this.skipPhase[name];
    }

    saveWithDupe(card) {
        if(card.owner.promptDupes) {
            return;
        }

        let player = card.controller;
        let dupe = card.dupes.find(dupe => dupe.owner === card.controller);
        if(card.canBeSaved() && dupe) {
            dupe.owner.discardCard(dupe, false);
            this.saveCard(card);
            this.addMessage('{0} discards a duplicate to save {1}', player, card);
            return true;
        }

        return false;
    }

    saveCard(card) {
        card.markAsSaved();
        this.raiseEvent('onCardSaved', { card: card });
    }

    discardFromPlay(cards, options = { allowSave: true }, callback = () => true) {
        let inPlayCards = cards.filter(card => card.location === 'play area');
        if(inPlayCards.length === 0) {
            return;
        }

        // The player object used is irrelevant - it shouldn't be referenced by
        // any abilities that respond to cards being discarded from play. This
        // should be a temporary workaround until better support is added for
        // simultaneous resolution of events.
        inPlayCards[0].owner.discardCards(inPlayCards, options.allowSave, callback, options);
    }

    killCharacters(cards, options = {}) {
        options = Object.assign({ allowSave: true, isBurn: false }, options);
        this.queueStep(new KillCharacters(this, cards, options));
    }

    killCharacter(card, options = {}) {
        this.killCharacters([card], options);
    }

    takeControl(player, card, source = null) {
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
            if(card.parent) {
                card.takeControl(newController, source);
            } else {
                oldController.removeCardFromPile(card);
                card.takeControl(newController, source);
                newController.cardsInPlay.push(card);
            }

            if(card.location !== 'play area') {
                let originalLocation = card.location;
                card.moveTo('play area');
                card.applyPersistentEffects();
                this.raiseEvent('onCardEntersPlay', { card: card, playingType: 'play', originalLocation: originalLocation });
            }

            this.handleControlChange(card);
        });
    }

    revertControl(card, source) {
        if(card.location !== 'play area') {
            return;
        }

        card.controller.removeCardFromPile(card);
        card.revertControl(source);
        card.controller.cardsInPlay.push(card);

        this.handleControlChange(card);
    }

    handleControlChange(card) {
        if(this.currentChallenge && this.currentChallenge.isParticipating(card)) {
            this.addMessage('{0} is removed from the challenge because control has changed', card);
            this.currentChallenge.removeFromChallenge(card);
        }

        this.raiseEvent('onCardTakenControl', { card: card });
    }

    applyGameAction(actionType, cards, func, options = {}) {
        let wasArray = Array.isArray(cards);
        if(!wasArray) {
            cards = [cards];
        }
        let allowed = options.force ? cards : cards.filter(card => card.allowGameAction(actionType));

        if(allowed.length === 0) {
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

        //check if the game has an event selected that restricts spectators
        if(this.event && this.event.restrictSpectators && this.event.validSpectators) {
            if(!this.event.validSpectators.includes(user.username.toLowerCase())) {
                return false;
            }
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);

        return true;
    }

    join(socketId, user) {
        if(this.started || this.getPlayers().length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(socketId, user, this.owner === user.username, this);

        return true;
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

        if(player.isSpectator() || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('info', '{0} has left the game', player);
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

        if(player.isSpectator()) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('warning', '{0} has disconnected.  The game will wait up to 30 seconds for them to reconnect', player);
            player.disconnectedAt = new Date();
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
        player.disconnectedAt = undefined;

        this.addAlert('info', '{0} has reconnected', player);
    }

    rematch() {
        if(!this.finishedAt) {
            this.finishedAt = new Date();
            this.winReason = 'rematch';
        }

        this.router.rematch(this);
    }

    timeExpired() {
        this.emit('onTimeExpired');
    }

    activatePersistentEffects() {
        this.effectEngine.add(new DynamicKeywordsEffect({ game: this }));
        this.effectEngine.activatePersistentEffects();
    }

    continue() {
        this.pipeline.continue();
    }

    getGameElementType() {
        return 'game';
    }

    pauseClock() {
        this.clockPaused = !this.clockPaused;
        if(this.useChessClocks) {
            let players = this.getPlayers();
            for(let player of players) {
                player.togglePauseChessClock();
            }
        }

        if(this.useGameTimeLimit) {
            this.timeLimit.togglePause();
        }
    }

    getSaveState() {
        var players = this.getPlayers().map(player => {
            return {
                name: player.name,
                faction: player.faction.name || player.faction.value,
                agenda: player.agenda ? player.agenda.name : undefined,
                power: player.getTotalPower(),
                playtested: this.isPlaytesting() ? player.preparedDeck.allCards.filter(card => !!card.version).map(card => card.cardData) : undefined
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
            for(let player of this.getAllPlayers()) {
                playerState[player.name] = player.getState(activePlayer);
            }

            this.timeLimit.checkForTimeLimitReached();

            return {
                id: this.id,
                isMelee: this.isMelee,
                name: this.name,
                owner: this.owner,
                players: playerState,
                messages: this.gameChat.messages,
                showHand: this.showHand,
                spectators: this.getSpectators().map(spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started,
                winner: this.winner ? this.winner.name : undefined,
                cancelPromptUsed: this.cancelPromptUsed,
                useGameTimeLimit: this.useGameTimeLimit,
                gameTimeLimitStarted: this.timeLimit.timeLimitStarted,
                gameTimeLimitStartedAt: this.timeLimit.timeLimitStartedAt,
                gameTimeLimitTime: this.timeLimit.timeLimitInSeconds,
                muteSpectators: this.muteSpectators,
                useChessClocks: this.useChessClocks,
                chessClockTimeLimit: this.chessClockTimeLimit,
                delayToStartClock: this.delayToStartClock
            };
        }

        return this.getSummary(activePlayerName);
    }

    getSummary(activePlayerName, options = {}) {
        var playerSummaries = {};

        for(let player of this.getAllPlayers()) {
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
                faction: player.faction.code,
                id: player.id,
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner,
                user: options.fullData && player.user
            };
        }

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.id,
            isMelee: this.isMelee,
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            showHand: this.showHand,
            started: this.started,
            startedAt: this.startedAt,
            spectators: this.getSpectators().map(spectator => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            }),
            muteSpectators: this.muteSpectators,
            restrictedList: this.restrictedList,
            useChessClocks: this.useChessClocks
        };
    }

    determineWinnerAfterTimeLimitExpired() {
        //find out the highest power total among all players left
        const highestPowerTotal = this.getPlayers().reduce((highestPowerTotal, player) => {
            if(highestPowerTotal < player.getTotalPower()) {
                highestPowerTotal = player.getTotalPower();
            }
            return highestPowerTotal;
        }, 0);
        //find out the highest number of cards left in a draw deck among the remaining players
        const mostCardsLeftInDrawDeck = this.getPlayers().reduce((mostCardsLeftInDrawDeck, player) => {
            if(mostCardsLeftInDrawDeck < player.drawDeck.length) {
                mostCardsLeftInDrawDeck = player.drawDeck.length;
            }
            return mostCardsLeftInDrawDeck;
        }, 0);
        //find out the smallest number of characters in a dead pile among the remaining players
        const smallestNumberOfCharsInDeadPile = this.getPlayers().reduce((smallestNumberOfCharsInDeadPile, player) => {
            if(smallestNumberOfCharsInDeadPile > player.deadPile.length) {
                smallestNumberOfCharsInDeadPile = player.deadPile.length;
            }
            return smallestNumberOfCharsInDeadPile;
        }, 1000);

        const rules = [
            player => player.canWinGame(),
            player => player.getTotalPower() >= highestPowerTotal,
            player => player.drawDeck.length >= mostCardsLeftInDrawDeck,
            player => {
                if(this.winnerOfDominanceInLastRound) {
                    return player.name === this.winnerOfDominanceInLastRound.name;
                }
                //if no one won dom, then this rule should not filter any players
                return true;
            },
            player => player.deadPile.length <= smallestNumberOfCharsInDeadPile,
            player => player.firstPlayer
        ];

        let remainingPlayers = this.getPlayers();
        for(const rule of rules) {
            remainingPlayers = remainingPlayers.filter(player => rule(player));
            if(remainingPlayers.length === 1) {
                this.recordWinner(remainingPlayers[0], 'time');
                return;
            } else if(remainingPlayers.length === 0) {
                this.recordDraw('No one');
                return;
            }
        }
        //this should not be reached as it means after filtering the players with every rule there are still multiple players left
        this.addAlert('After checking for every tie breaker rule to determine the winner of the game, no winner could be determined. This should not have happened. Please report this to the developers as it is likely a bug.');
        this.recordDraw('No one');
    }

    toggleMuteSpectators(playerName) {
        let player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.chatCommands.muteSpectators(player);
    }
}

module.exports = Game;
