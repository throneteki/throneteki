const _ = require('underscore');

const Spectator = require('./spectator.js');
const DrawCard = require('./drawcard.js');
const Deck = require('./Deck');
const AbilityContext = require('./AbilityContext.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const BestowPrompt = require('./gamesteps/bestowprompt.js');
const ChallengeTracker = require('./challengetracker.js');
const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');
const MinMaxProperty = require('./PropertyTypes/MinMaxProperty');
const GoldSource = require('./GoldSource.js');

const logger = require('../log.js');

const StartingHandSize = 7;
const DrawPhaseCards = 2;
const MarshalIntoShadowsCost = 2;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.beingPlayed = [];
        this.drawDeck = [];
        this.plotDeck = [];
        this.plotDiscard = [];
        this.hand = [];
        this.cardsInPlay = [];
        this.deadPile = [];
        this.discardPile = [];
        this.outOfGamePile = [];
        this.shadows = [];

        // Agenda specific piles
        this.bannerCards = [];
        this.conclavePile = [];

        this.faction = new DrawCard(this, {});

        this.owner = owner;
        this.takenMulligan = false;
        this.game = game;

        this.setupGold = 8;
        this.cardsInPlayBeforeSetup = [];
        this.deck = {};
        this.challenges = new ChallengeTracker(this);
        this.minReserve = 0;
        this.costReducers = [];
        this.playableLocations = this.createDefaultPlayableLocations();
        this.usedPlotsModifier = 0;
        this.attackerLimits = new MinMaxProperty({ defaultMin: 0, defaultMax: 0 });
        this.defenderLimits = new MinMaxProperty({ defaultMin: 0, defaultMax: 0 });
        this.gainedGold = 0;
        this.maxGoldGain = new MinMaxProperty({ defaultMin: 0, defaultMax: undefined });
        this.drawnCards = 0;
        this.maxCardDraw = new MinMaxProperty({ defaultMin: 0, defaultMax: undefined });
        this.doesNotReturnUnspentGold = false;
        this.cannotGainChallengeBonus = false;
        this.cannotWinGame = false;
        this.triggerRestrictions = [];
        this.playCardRestrictions = [];
        this.abilityMaxByTitle = {};
        this.standPhaseRestrictions = [];
        this.multipleOpponentClaim = [];
        this.mustChooseAsClaim = [];
        this.plotRevealRestrictions = [];
        this.mustRevealPlot = undefined;
        this.promptedActionWindows = user.promptedActionWindows;
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.keywordSettings = user.settings.keywordSettings;
        this.goldSources = [new GoldSource(this)];
        this.groupedPiles = {};
        this.bonusesFromRivals = new Set();
        this.shuffleArray = _.shuffle;

        this.promptState = new PlayerPromptState();
    }

    createDefaultPlayableLocations() {
        let playFromHand = ['marshal', 'play', 'ambush'].map(playingType => new PlayableLocation(playingType, card => card.controller === this && card.location === 'hand'));
        let playFromShadows = ['play'].map(playingType => new PlayableLocation(playingType, card => card.controller === this && card.location === 'shadows'));
        return playFromHand.concat(playFromShadows);
    }

    isCardUuidInList(list, card) {
        return list.some(c => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list, card) {
        return list.some(c => {
            return c.name === card.name;
        });
    }

    areCardsSelected() {
        return this.cardsInPlay.some(card => {
            return card.selected;
        });
    }

    removeCardByUuid(list, uuid) {
        return list.filter(card => {
            return card.uuid !== uuid;
        });
    }

    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    findCard(cardList, predicate) {
        var cards = this.findCards(cardList, predicate);
        if(!cards || _.isEmpty(cards)) {
            return undefined;
        }

        return cards[0];
    }

    findCards(cardList, predicate) {
        if(!cardList) {
            return;
        }

        var cardsToReturn = [];

        for(let card of cardList) {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn = cardsToReturn.concat(card.attachments.filter(predicate));
            }
        }

        return cardsToReturn;
    }

    anyCardsInPlay(predicate) {
        return this.game.allCards.some(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if(card.controller === this && card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.game.allCards.find(playCard => (
            playCard.controller === this &&
            playCard.location === 'play area' &&
            playCard !== card &&
            (playCard.code === card.code || playCard.name === card.name) &&
            playCard.owner === this
        ));
    }

    getFaction() {
        return this.faction.getPrintedFaction();
    }

    getNumberOfChallengesWon(challengeType) {
        return this.challenges.getWon(challengeType);
    }

    getNumberOfChallengesLost(challengeType) {
        return this.challenges.getLost(challengeType);
    }

    getNumberOfChallengesInitiatedByType(challengeType) {
        return this.challenges.getPerformed(challengeType);
    }

    getNumberOfChallengesInitiated() {
        return this.challenges.getPerformed();
    }

    getNumberOfUsedPlots() {
        return this.plotDiscard.length + this.usedPlotsModifier;
    }

    getPlots() {
        return this.plotDeck.filter(plot => !plot.notConsideredToBeInPlotDeck);
    }

    addGoldSource(source) {
        this.goldSources.unshift(source);
    }

    removeGoldSource(source) {
        this.goldSources = this.goldSources.filter(s => s !== source);
    }

    getSpendableGoldSources(spendParams) {
        let activePlayer = spendParams.activePlayer || this.game.currentAbilityContext && this.game.currentAbilityContext.player || this;
        let defaultedSpendParams = Object.assign({ activePlayer: activePlayer, playingType: 'ability' }, spendParams);
        return this.goldSources.filter(source => source.allowSpendingFor(defaultedSpendParams));
    }

    getSpendableGold(spendParams = {}) {
        let validSources = this.getSpendableGoldSources(spendParams);
        return validSources.reduce((sum, source) => sum + source.gold, 0);
    }

    modifyGold(amount) {
        this.gold += amount;

        if(this.gold < 0) {
            amount += -this.gold;
            this.gold = 0;
        }

        return amount;
    }

    modifyUsedPlots(value) {
        this.usedPlotsModifier += value;
        this.game.raiseEvent('onUsedPlotsModified', { player: this });
    }

    drawCardsToHand(numCards) {
        if(numCards > this.drawDeck.length) {
            numCards = this.drawDeck.length;
        }

        if(this.maxCardDraw.getMax() !== undefined) {
            numCards = Math.min(numCards, this.maxCardDraw.getMax() - this.drawnCards);
        }

        if(numCards < 0) {
            numCards = 0;
        }

        let cards = this.drawDeck.slice(0, numCards);

        for(const card of cards) {
            this.moveCard(card, 'hand');
        }

        this.drawnCards += numCards;

        if(this.game.currentPhase !== 'setup') {
            this.game.raiseEvent('onCardsDrawn', { cards: cards, player: this });
        }

        if(this.drawDeck.length === 0) {
            this.game.playerDecked(this);
        }

        return cards;
    }

    searchDrawDeck(limit, predicate = () => true) {
        let cards = this.drawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = this.drawDeck.slice(0, limit);
            } else {
                cards = this.drawDeck.slice(limit);
            }
        }

        return cards.filter(predicate);
    }

    shuffleDrawDeck() {
        this.drawDeck = this.shuffleArray(this.drawDeck);
    }

    discardFromDraw(number, callback = () => true) {
        number = Math.min(number, this.drawDeck.length);

        var cards = this.drawDeck.slice(0, number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
            if(this.drawDeck.length === 0) {
                this.game.playerDecked(this);
            }
        });
    }

    moveFromTopToBottomOfDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.drawDeck[0], 'draw deck', { bottom: true });

            number--;
        }
    }

    discardAtRandom(number, callback = () => true) {
        var toDiscard = Math.min(number, this.hand.length);
        var cards = [];

        while(cards.length < toDiscard) {
            var cardIndex = _.random(0, this.hand.length - 1);

            var card = this.hand[cardIndex];
            if(!cards.includes(card)) {
                cards.push(card);
            }
        }

        this.discardCards(cards, false, discarded => {
            this.game.addMessage('{0} discards {1} at random', this, discarded);
            callback(discarded);
        });
    }

    canInitiateChallenge(challengeType, opponent) {
        return this.challenges.canInitiate(challengeType, opponent);
    }

    canGainGold() {
        return (this.maxGoldGain.getMax() === undefined || this.gainedGold < this.maxGoldGain.getMax());
    }

    canDraw() {
        return (this.maxCardDraw.getMax() === undefined || this.drawnCards < this.maxCardDraw.getMax());
    }

    canSelectAsFirstPlayer(player) {
        if(this.firstPlayerSelectCondition) {
            return this.firstPlayerSelectCondition(player);
        }

        return true;
    }

    addAllowedChallenge(allowedChallenge) {
        this.challenges.addAllowedChallenge(allowedChallenge);
    }

    removeAllowedChallenge(allowedChallenge) {
        this.challenges.removeAllowedChallenge(allowedChallenge);
    }

    setMaxChallenge(number) {
        this.challenges.setMax(number);
    }

    clearMaxChallenge() {
        this.challenges.clearMax();
    }

    addChallengeRestriction(restriction) {
        this.challenges.addRestriction(restriction);
    }

    removeChallengeRestriction(restriction) {
        this.challenges.removeRestriction(restriction);
    }

    resetCardPile(pile) {
        for(const card of pile) {
            if(pile !== this.cardsInPlay || !this.cardsInPlayBeforeSetup.includes(card)) {
                card.moveTo('draw deck');
                this.drawDeck.push(card);
            }
        }
    }

    resetDrawDeck() {
        this.resetCardPile(this.hand);
        this.hand = [];

        this.resetCardPile(this.cardsInPlay);
        this.cardsInPlay = this.cardsInPlay.filter(card => this.cardsInPlayBeforeSetup.includes(card));

        this.resetCardPile(this.discardPile);
        this.discardPile = [];

        this.resetCardPile(this.deadPile);
        this.deadPile = [];
    }

    initDrawDeck() {
        this.resetDrawDeck();
        this.shuffleDrawDeck();
    }

    drawSetupHand() {
        this.drawCardsToHand(StartingHandSize);
    }

    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        this.plotDeck = preparedDeck.plotCards;
        this.agenda = preparedDeck.agenda;
        this.faction = preparedDeck.faction;
        this.drawDeck = preparedDeck.drawCards;
        this.bannerCards = preparedDeck.bannerCards;
        this.preparedDeck = preparedDeck;

        this.shuffleDrawDeck();
    }

    initialise() {
        this.createFactionAndAgenda();

        this.gold = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.activePlot = undefined;
    }

    createFactionAndAgenda() {
        let deck = new Deck(this.deck);
        this.faction = deck.createFactionCard(this);
        this.agenda = deck.createAgendaCard(this);
    }

    startGame() {
        if(!this.readyToStart) {
            return;
        }

        this.gold = this.setupGold;
    }

    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initDrawDeck();
        this.drawSetupHand();
        this.takenMulligan = true;
        this.readyToStart = true;

        return true;
    }

    keep() {
        this.readyToStart = true;
    }

    addCostReducer(reducer) {
        this.costReducers.push(reducer);
    }

    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    getCostReduction(playingType, card) {
        let matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        let reduction = _.reduce(matchingReducers, (memo, reducer) => reducer.getAmount(card) + memo, 0);
        return reduction;
    }

    getReducedCost(playingType, card) {
        let baseCost = this.getBaseCost(playingType, card);
        let reducedCost = baseCost - this.getCostReduction(playingType, card);
        return Math.max(reducedCost, card.getMinCost());
    }

    getBaseCost(playingType, card) {
        if(playingType === 'marshalIntoShadows') {
            return MarshalIntoShadowsCost;
        }

        if(playingType === 'outOfShadows' || playingType === 'play' && card.location === 'shadows') {
            return card.getShadowCost();
        }

        if(playingType === 'ambush') {
            return card.getAmbushCost();
        }

        return card.getCost();
    }

    markUsedReducers(playingType, card) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        _.each(matchingReducers, reducer => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    registerAbilityMax(cardName, limit) {
        if(this.abilityMaxByTitle[cardName]) {
            return;
        }

        this.abilityMaxByTitle[cardName] = limit;
        limit.registerEvents(this.game);
    }

    isAbilityAtMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(!limit) {
            return false;
        }

        return limit.isAtMax();
    }

    incrementAbilityMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(limit) {
            limit.increment();
        }
    }

    isCharacterDead(card) {
        return card.getType() === 'character' && card.isUnique() && this.isCardNameInList(this.deadPile, card);
    }

    playCard(card) {
        if(!card) {
            return false;
        }

        let context = new AbilityContext({
            game: this.game,
            player: this,
            source: card
        });
        var playActions = _.filter(card.getPlayActions(), action => action.meetsRequirements(context) && action.canPayCosts(context) && action.canResolveTargets(context));

        if(playActions.length === 0) {
            return false;
        }

        if(playActions.length === 1) {
            this.game.resolveAbility(playActions[0], context);
        } else {
            this.game.queueStep(new PlayActionPrompt(this.game, this, playActions, context));
        }

        return true;
    }

    canTrigger(card) {
        return !_.any(this.triggerRestrictions, restriction => restriction(card));
    }

    canPlay(card, playingType = 'play') {
        return !_.any(this.playCardRestrictions, restriction => restriction(card, playingType));
    }

    canPutIntoPlay(card, playingType = 'play', options = {}) {
        if(card.getType() === 'event') {
            return false;
        }

        if(!options.isEffectExpiration && !this.canPlay(card, playingType)) {
            return false;
        }

        return this.canControl(card);
    }

    canControl(card) {
        let owner = card.owner;

        if(!card.isUnique()) {
            return true;
        }

        if(this.isCharacterDead(card) && !this.canResurrect(card)) {
            return false;
        }

        if(owner === this) {
            let controlsAnOpponentsCopy = this.anyCardsInPlay(c => c.name === card.name && c.owner !== this);
            let opponentControlsOurCopy = _.any(this.game.getPlayers(), player => {
                return player !== this && player.anyCardsInPlay(c => c.name === card.name && c.owner === this && c !== card);
            });

            return !controlsAnOpponentsCopy && !opponentControlsOurCopy;
        }

        if(owner.isCharacterDead(card) && !owner.canResurrect(card)) {
            return false;
        }

        let controlsACopy = this.anyCardsInPlay(c => c.name === card.name);
        let opponentControlsACopy = owner.anyCardsInPlay(c => c.name === card.name && c !== card);

        return !controlsACopy && !opponentControlsACopy;
    }

    canResurrect(card) {
        return this.deadPile.includes(card) && (!card.isUnique() || this.deadPile.filter(c => c.name === card.name).length === 1);
    }

    putIntoPlay(card, playingType = 'play', options = {}) {
        if(!options.force && !this.canPutIntoPlay(card, playingType, options)) {
            return;
        }

        var dupeCard = this.getDuplicateInPlay(card);

        if(card.getType() === 'attachment' && playingType !== 'setup' && !dupeCard) {
            this.promptForAttachment(card, playingType);
            return;
        }

        if(dupeCard && playingType !== 'setup') {
            this.removeCardFromPile(card);
            dupeCard.addDuplicate(card);
        } else {
            // Attachments placed in setup should not be considered to be 'played',
            // as it will cause then to double their effects when attached later.
            let isSetupAttachment = playingType === 'setup' && card.getType() === 'attachment';

            let originalLocation = card.location;

            card.facedown = this.game.currentPhase === 'setup';
            card.new = true;
            this.moveCard(card, 'play area', { isDupe: !!dupeCard });
            card.takeControl(this);
            card.kneeled = playingType !== 'setup' && !!card.entersPlayKneeled || !!options.kneeled;
            card.wasAmbush = (playingType === 'ambush');

            if(!dupeCard && !isSetupAttachment) {
                card.applyPersistentEffects();
            }

            this.game.queueSimpleStep(() => {
                if(this.game.currentPhase !== 'setup' && card.isBestow()) {
                    this.game.queueStep(new BestowPrompt(this.game, this, card));
                }
            });

            this.game.raiseEvent('onCardEntersPlay', { card: card, playingType: playingType, originalLocation: originalLocation });
        }
    }

    putIntoShadows(card) {
        this.moveCard(card, 'shadows');
    }

    setupDone() {
        if(this.hand.length < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.length);
        }

        let processedCards = [];

        for(const card of this.cardsInPlay) {
            card.facedown = false;

            if(!card.isUnique()) {
                processedCards.push(card);
                continue;
            }

            let duplicate = this.findCardByName(processedCards, card.name);

            if(duplicate) {
                duplicate.addDuplicate(card);
            } else {
                processedCards.push(card);
            }
        }

        this.cardsInPlay = processedCards;
        this.gold = 0;
    }

    startPlotPhase() {
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.roundDone = false;

        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.gainedGold = 0;
        this.drawnCards = 0;
        this.challenges.reset();

        this.drawPhaseCards = DrawPhaseCards;

        this.limitedPlayed = 0;

        this.bonusesFromRivals.clear();
    }

    flipPlotFaceup() {
        if(!this.selectedPlot) {
            return;
        }

        this.selectedPlot.flipFaceup();
        this.moveCard(this.selectedPlot, 'active plot');
        this.selectedPlot = undefined;
    }

    recyclePlots() {
        const plots = this.plotDeck.filter(plot => !plot.notConsideredToBeInPlotDeck);
        if(plots.length === 0) {
            for(const plot of this.plotDiscard) {
                this.moveCard(plot, 'plot deck');
            }

            this.game.raiseEvent('onPlotsRecycled', { player: this });
        }
    }

    removeActivePlot() {
        if(this.activePlot) {
            let plot = this.activePlot;
            this.moveCard(this.activePlot, 'revealed plots');
            this.game.raiseEvent('onPlotDiscarded', { player: this, card: plot });
            this.activePlot = undefined;
            return plot;
        }
    }

    drawPhase() {
        if(this.canDraw()) {
            this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
            this.drawCardsToHand(this.drawPhaseCards);
        }
    }

    beginMarshal() {
        if(this.canGainGold()) {
            let gold = this.game.addGold(this, this.getTotalIncome());
            this.game.addMessage('{0} collects {1} gold', this, gold);
        }

        this.game.raiseEvent('onIncomeCollected', { player: this });
    }

    hasUnmappedAttachments() {
        return this.cardsInPlay.some(card => {
            return card.getType() === 'attachment';
        });
    }

    canAttach(attachment, card) {
        if(!attachment || !card) {
            return false;
        }

        return (
            card.location === 'play area' &&
            card !== attachment &&
            card.allowAttachment(attachment) &&
            attachment.canAttach(this, card)
        );
    }

    attach(controller, attachment, card, playingType) {
        if(!card || !attachment) {
            return;
        }

        if(!controller.canAttach(attachment, card)) {
            return;
        }

        let originalLocation = attachment.location;

        attachment.owner.removeCardFromPile(attachment);

        let dupeCard = this.getDuplicateInPlay(attachment);
        if(dupeCard && dupeCard.controller === attachment.controller) {
            dupeCard.addDuplicate(attachment);
            if(originalLocation !== 'play area') {
                this.game.raiseEvent('onCardEntersPlay', { card: attachment, playingType: playingType, originalLocation: originalLocation });
            }
            return;
        }

        attachment.moveTo('play area', card);
        attachment.takeControl(controller);
        card.attachments.push(attachment);

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
        });

        this.game.queueSimpleStep(() => {
            if(this.game.currentPhase !== 'setup' && attachment.isBestow()) {
                this.game.queueStep(new BestowPrompt(this.game, controller, attachment));
            }
        });

        if(originalLocation !== 'play area') {
            this.game.raiseEvent('onCardEntersPlay', { card: attachment, playingType: playingType, originalLocation: originalLocation });
        }

        this.game.raiseEvent('onCardAttached', { card: attachment, parent: card });
    }

    showDrawDeck() {
        this.showDeck = true;
    }

    getSourceList(source) {
        switch(source) {
            case 'being played':
                return this.beingPlayed;
            case 'hand':
                return this.hand;
            case 'draw deck':
                return this.drawDeck;
            case 'discard pile':
                return this.discardPile;
            case 'dead pile':
                return this.deadPile;
            case 'play area':
                return this.cardsInPlay;
            case 'active plot':
                return [];
            case 'plot deck':
                return this.plotDeck;
            case 'revealed plots':
                return this.plotDiscard;
            case 'out of game':
                return this.outOfGamePile;
            case 'shadows':
                return this.shadows;
            // Agenda specific piles
            case 'conclave':
                return this.conclavePile;
        }
    }

    updateSourceList(source, targetList) {
        switch(source) {
            case 'being played':
                this.beingPlayed = targetList;
                return;
            case 'hand':
                this.hand = targetList;
                break;
            case 'draw deck':
                this.drawDeck = targetList;
                break;
            case 'discard pile':
                this.discardPile = targetList;
                break;
            case 'dead pile':
                this.deadPile = targetList;
                break;
            case 'play area':
                this.cardsInPlay = targetList;
                break;
            case 'plot deck':
                this.plotDeck = targetList;
                break;
            case 'revealed plots':
                this.plotDiscard = targetList;
                break;
            case 'out of game':
                this.outOfGamePile = targetList;
                break;
            case 'shadows':
                this.shadows = targetList;
                break;
            // Agenda specific piles
            case 'conclave':
                this.conclavePile = targetList;
        }
    }

    promptForAttachment(card, playingType) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    beginChallenge() {
        for(const card of this.cardsInPlay) {
            card.resetForChallenge();
        }
    }

    trackChallenge(challenge) {
        this.challenges.track(challenge);
    }

    getParticipatedChallenges() {
        return this.challenges.getChallenges();
    }

    resetForChallenge() {
        for(const card of this.cardsInPlay) {
            card.resetForChallenge();
        }
    }

    sacrificeCard(card) {
        this.game.applyGameAction('sacrifice', card, card => {
            this.game.raiseEvent('onSacrificed', { player: this, card: card }, event => {
                event.cardStateWhenSacrificed = card.createSnapshot();
                this.moveCard(card, 'discard pile');
            });
        });
    }

    discardCard(card, allowSave = true, options = {}) {
        this.discardCards([card], allowSave, () => true, options);
    }

    discardCards(cards, allowSave = true, callback = () => true, options = {}) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                allowSave: allowSave,
                automaticSaveWithDupe: true,
                originalLocation: cards[0].location
            };
            this.game.raiseSimultaneousEvent(cards, {
                eventName: 'onCardsDiscarded',
                params: params,
                handler: () => true,
                perCardEventName: 'onCardDiscarded',
                perCardHandler: event => {
                    this.moveCard(event.card, 'discard pile');
                },
                postHandler: event => {
                    callback(event.cards);
                }
            });
        }, { force: options.force });
    }

    returnCardToHand(card, allowSave = true) {
        this.game.applyGameAction('returnToHand', card, card => {
            this.moveCard(card, 'hand', { allowSave: allowSave });
        });
    }

    removeCardFromGame(card, allowSave = true) {
        this.game.applyGameAction('removeFromGame', card, card => {
            this.moveCard(card, 'out of game', { allowSave: allowSave });
        });
    }

    moveCardToTopOfDeck(card, allowSave = true) {
        this.game.applyGameAction('moveToTopOfDeck', card, card => {
            this.moveCard(card, 'draw deck', { allowSave: allowSave });
        });
    }

    moveCardToBottomOfDeck(card, allowSave = true) {
        this.game.applyGameAction('moveToBottomOfDeck', card, card => {
            this.moveCard(card, 'draw deck', { bottom: true, allowSave: allowSave });
        });
    }

    shuffleCardIntoDeck(card, allowSave = true) {
        this.game.applyGameAction('shuffleIntoDeck', card, card => {
            this.moveCard(card, 'draw deck', { allowSave: allowSave }, () => {
                this.shuffleDrawDeck();
            });
        });
    }

    /**
     * @deprecated Use `Game.killCharacter` instead.
     */
    killCharacter(card, allowSave = true) {
        this.game.killCharacter(card, { allowSave: allowSave });
    }

    getDominance() {
        let cardStrength = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getDominanceStrength();
        }, 0);

        if(this.title) {
            cardStrength += this.title.getDominanceStrength();
        }

        return cardStrength + this.gold;
    }

    getTotalPower() {
        var power = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getPower();
        }, this.faction.power);

        return power;
    }

    removeAttachment(attachment, allowSave = true) {
        attachment.isBeingRemoved = true;
        if(attachment.isTerminal()) {
            attachment.owner.moveCard(attachment, 'discard pile', { allowSave: allowSave }, () => {
                attachment.isBeingRemoved = false;
            });
        } else {
            attachment.owner.moveCard(attachment, 'hand', { allowSave: allowSave }, () => {
                attachment.isBeingRemoved = false;
            });
        }
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        this.faction.cardData = deck.faction;
        this.faction.cardData.name = deck.faction.name;
        this.faction.cardData.code = deck.faction.value;
        this.faction.cardData.type = 'faction';
        this.faction.cardData.strength = 0;
    }

    moveCard(card, targetLocation, options = {}, callback) {
        let targetPile = this.getSourceList(targetLocation);

        options = _.extend({ allowSave: false, bottom: false, isDupe: false }, options);

        if(!targetPile) {
            return;
        }

        if(card.owner !== this && targetLocation !== 'play area') {
            card.owner.moveCard(card, targetLocation, options, callback);
            return;
        }

        if(card.location === 'play area') {
            var params = {
                player: this,
                card: card,
                allowSave: options.allowSave,
                automaticSaveWithDupe: true
            };

            this.game.raiseEvent('onCardLeftPlay', params, () => {
                this.synchronousMoveCard(card, targetLocation, options);

                if(callback) {
                    callback();
                }
            });
            return;
        }

        this.synchronousMoveCard(card, targetLocation, options);
        if(callback) {
            callback();
        }
    }

    synchronousMoveCard(card, targetLocation, options = {}) {
        this.removeCardFromPile(card);

        let targetPile = this.getSourceList(targetLocation);

        if(!targetPile || targetPile.includes(card)) {
            return;
        }

        if(card.location === 'play area') {
            for(const attachment of card.attachments) {
                this.removeAttachment(attachment, false);
            }

            if(card.dupes.length !== 0) {
                this.discardCards(card.dupes, false);
            }
        }

        if(['play area', 'active plot'].includes(card.location)) {
            card.leavesPlay();
        }

        if(card.location === 'active plot') {
            this.game.raiseEvent('onCardLeftPlay', { player: this, card: card });
        }

        card.moveTo(targetLocation);

        if(targetLocation === 'active plot') {
            this.activePlot = card;
        } else if(targetLocation === 'draw deck' && !options.bottom) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(['dead pile', 'discard pile', 'revealed plots'].includes(targetLocation)) {
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation, player: this });
        }
    }

    kneelCard(card, options = {}) {
        if(card.kneeled) {
            return;
        }

        this.game.applyGameAction('kneel', card, card => {
            card.kneeled = true;

            this.game.raiseEvent('onCardKneeled', { player: this, card: card });
        }, { force: options.force });
    }

    standCard(card, options = {}) {
        if(!card.kneeled) {
            return;
        }

        this.game.applyGameAction('stand', card, card => {
            card.kneeled = false;

            this.game.raiseEvent('onCardStood', { player: this, card: card });
        }, { force: options.force });
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            card.takeControl(card.owner);
            return;
        }

        if(card.parent) {
            card.parent.removeChildCard(card);
            card.parent = undefined;
        }

        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    getTotalInitiative() {
        if(!this.activePlot) {
            return 0;
        }

        return this.activePlot.getInitiative();
    }

    getTotalIncome() {
        if(!this.activePlot) {
            return 0;
        }

        return this.activePlot.getIncome();
    }

    getTotalReserve() {
        if(!this.activePlot) {
            return 0;
        }

        let totalReserve = Math.max(this.activePlot.getReserve(), this.minReserve);
        if(_.isNaN(totalReserve) || _.isUndefined(totalReserve)) {
            let payload = {
                minReserve: this.minReserve,
                baseReserve: this.activePlot.cardData.reserve,
                reserveModifier: this.activePlot.reserveModifier
            };

            logger.error('RESERVE BUG: ', payload);
        }

        return Math.max(this.activePlot.getReserve(), this.minReserve);
    }

    getClaim() {
        return this.activePlot ? this.activePlot.getClaim() : 0;
    }

    isBelowReserve() {
        return this.hand.length <= this.getTotalReserve();
    }

    isRival(opponent) {
        if(!this.title) {
            return false;
        }

        return this.title.isRival(opponent.title);
    }

    isSupporter(opponent) {
        if(!this.title) {
            return false;
        }

        return this.title.isSupporter(opponent.title);
    }

    canGainRivalBonus(opponent) {
        return !this.cannotGainChallengeBonus && this.isRival(opponent) && !this.bonusesFromRivals.has(opponent);
    }

    markRivalBonusGained(opponent) {
        this.bonusesFromRivals.add(opponent);
    }

    allowMultipleOpponentClaim(claimType) {
        return this.multipleOpponentClaim.includes(claimType);
    }

    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
    }

    getSelectableCards() {
        return this.promptState.selectableCards;
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    getGameElementType() {
        return 'player';
    }

    getStats(isActivePlayer) {
        return {
            claim: this.getClaim(),
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            reserve: this.getTotalReserve(),
            totalPower: this.getTotalPower()
        };
    }

    showHandtoSpectators(player) {
        return this.game.isSpectator(player) && this.game.showHand;
    }

    disableTimerForRound() {
        this.noTimer = true;
        this.resetTimerAtEndOfRound = true;
    }

    isTimerEnabled() {
        return !this.noTimer && this.user.settings.windowTimer !== 0;
    }

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let fullDiscardPile = this.discardPile.concat(this.beingPlayed);

        let plots = [];

        // Rains
        if(this.agenda && this.agenda.code === '05045') {
            for(const plot of this.plotDeck) {
                let plotSummary = plot.getSummary(activePlayer, true);
                if(plot.hasTrait('scheme')) {
                    plotSummary.group = 'Scheme';
                } else {
                    plotSummary.group = 'Plot';
                }

                plots.push(plotSummary);
            }
        } else {
            plots = this.getSummaryForCardList(this.plotDeck, activePlayer, true);
        }

        let state = {
            activePlot: this.activePlot ? this.activePlot.getSummary(activePlayer) : undefined,
            agenda: this.agenda ? this.agenda.getSummary(activePlayer) : undefined,
            cardPiles: {
                bannerCards: this.getSummaryForCardList(this.bannerCards, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conclavePile: this.getSummaryForCardList(this.conclavePile, activePlayer, true),
                deadPile: this.getSummaryForCardList(this.deadPile, activePlayer).reverse(),
                discardPile: this.getSummaryForCardList(fullDiscardPile, activePlayer).reverse(),
                hand: this.getSummaryForCardList(this.hand, activePlayer, !this.showHandtoSpectators(activePlayer)),
                outOfGamePile: this.getSummaryForCardList(this.outOfGamePile, activePlayer, false),
                plotDeck: plots,
                plotDiscard: this.getSummaryForCardList(this.plotDiscard, activePlayer),
                shadows: this.getSummaryForCardList(this.shadows, activePlayer, !this.showHandtoSpectators(activePlayer))
            },
            disconnected: this.disconnected,
            faction: this.faction.getSummary(activePlayer),
            firstPlayer: this.firstPlayer,
            id: this.id,
            keywordSettings: this.keywordSettings,
            left: this.left,
            numDrawCards: this.drawDeck.length,
            name: this.name,
            numPlotCards: this.plotDeck.length,
            phase: this.phase,
            plotSelected: !!this.selectedPlot,
            promptedActionWindows: this.promptedActionWindows,
            stats: this.getStats(isActivePlayer),
            timerSettings: this.timerSettings,
            title: this.title ? this.title.getSummary(activePlayer) : undefined,
            user: _.pick(this.user, ['username'])
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.cardPiles.drawDeck = this.getSummaryForCardList(this.drawDeck, activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
