const _ = require('underscore');

const Spectator = require('./spectator.js');
const DrawCard = require('./drawcard.js');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const BestowPrompt = require('./gamesteps/bestowprompt.js');
const ChallengeTracker = require('./challengetracker.js');
const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');

const StartingHandSize = 7;
const DrawPhaseCards = 2;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.drawDeck = _([]);
        this.plotDeck = _([]);
        this.plotDiscard = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]);
        this.deadPile = _([]);
        this.discardPile = _([]);
        this.outOfGamePile = _([]);

        // Agenda specific piles
        this.schemePlots = _([]);
        this.conclavePile = _([]);

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
        this.playableLocations = _.map(['marshal', 'play', 'ambush'], playingType => new PlayableLocation(playingType, this, 'hand'));
        this.usedPlotsModifier = 0;
        this.cannotGainGold = false;
        this.doesNotReturnUnspentGold = false;
        this.cannotGainChallengeBonus = false;
        this.cannotTriggerCardAbilities = false;
        this.playCardRestrictions = [];
        this.abilityMaxByTitle = {};
        this.standPhaseRestrictions = [];
        this.mustChooseAsClaim = [];
        this.promptedActionWindows = user.promptedActionWindows;
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.keywordSettings = user.settings.keywordSettings;

        this.promptState = new PlayerPromptState();
    }

    isCardUuidInList(list, card) {
        return list.any(c => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list, card) {
        return list.any(c => {
            return c.name === card.name;
        });
    }

    areCardsSelected() {
        return this.cardsInPlay.any(card => {
            return card.selected;
        });
    }

    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    findCardByUuidInAnyList(uuid) {
        return this.findCardByUuid(this.allCards, uuid);
    }

    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
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

        cardList.each(card => {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn = cardsToReturn.concat(card.attachments.filter(predicate));
            }

            return cardsToReturn;
        });

        return cardsToReturn;
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

    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.allCards.find(playCard => (
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
        return this.plotDiscard.size() + this.usedPlotsModifier;
    }

    modifyUsedPlots(value) {
        this.usedPlotsModifier += value;
        this.game.raiseEvent('onUsedPlotsModified', { player: this });
    }

    drawCardsToHand(numCards) {
        if(numCards > this.drawDeck.size()) {
            numCards = this.drawDeck.size();
        }

        let cards = this.drawDeck.first(numCards);

        _.each(cards, card => {
            this.moveCard(card, 'hand');
        });

        if(this.game.currentPhase !== 'setup') {
            this.game.raiseEvent('onCardsDrawn', { cards: cards, player: this });
        }

        if(this.drawDeck.size() === 0) {
            this.game.playerDecked(this);
        }

        return (cards.length > 1) ? cards : cards[0];
    }

    searchDrawDeck(limit, predicate) {
        var cards = this.drawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.drawDeck.first(limit));
            } else {
                cards = _(this.drawDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    shuffleDrawDeck() {
        this.drawDeck = _(this.drawDeck.shuffle());
    }

    discardFromDraw(number, callback = () => true) {
        number = Math.min(number, this.drawDeck.size());

        var cards = this.drawDeck.first(number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
            if(this.drawDeck.size() === 0) {
                this.game.playerDecked(this);
            }
        });
    }

    moveFromTopToBottomOfDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.drawDeck.first(), 'draw deck', { bottom: true });

            number--;
        }
    }

    discardAtRandom(number, callback = () => true) {
        var toDiscard = Math.min(number, this.hand.size());
        var cards = [];

        while(cards.length < toDiscard) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var card = this.hand.value()[cardIndex];
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

    canSelectAsFirstPlayer(player) {
        if(this.firstPlayerSelectCondition) {
            return this.firstPlayerSelectCondition(player);
        }

        return true;
    }

    addChallenge(type, number) {
        this.challenges.modifyMaxForType(type, number);
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
        pile.each(card => {
            if(pile !== this.cardsInPlay || !this.cardsInPlayBeforeSetup.includes(card)) {
                card.moveTo('draw deck');
                this.drawDeck.push(card);
            }
        });
    }

    resetDrawDeck() {
        this.resetCardPile(this.hand);
        this.hand = _([]);

        this.resetCardPile(this.cardsInPlay);
        this.cardsInPlay = _(this.cardsInPlay.filter(card => this.cardsInPlayBeforeSetup.includes(card)));

        this.resetCardPile(this.discardPile);
        this.discardPile = _([]);

        this.resetCardPile(this.deadPile);
        this.deadPile = _([]);
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
        this.plotDeck = _(preparedDeck.plotCards);
        this.agenda = preparedDeck.agenda;
        this.faction = preparedDeck.faction;
        this.drawDeck = _(preparedDeck.drawCards);
        this.bannerCards = _(preparedDeck.bannerCards);
        this.allCards = _(preparedDeck.allCards);
    }

    initialise() {
        this.prepareDecks();
        this.initDrawDeck();

        this.gold = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.activePlot = undefined;
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

    getReducedCost(playingType, card) {
        var baseCost = playingType === 'ambush' ? card.getAmbushCost() : card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card), baseCost);
        return Math.max(reducedCost, card.getMinCost());
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

        var context = {
            game: this.game,
            player: this,
            source: card
        };
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

    canPlay(card, playingType = 'play') {
        return !_.any(this.playCardRestrictions, restriction => restriction(card, playingType));
    }

    canPutIntoPlay(card, playingType = 'play') {
        if(!this.canPlay(card, playingType)) {
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

    putIntoPlay(card, playingType = 'play') {
        if(!this.canPutIntoPlay(card, playingType)) {
            return;
        }

        var dupeCard = this.getDuplicateInPlay(card);

        if(card.getType() === 'attachment' && playingType !== 'setup' && !dupeCard) {
            this.promptForAttachment(card, playingType);

            if(this.game.currentPhase !== 'setup' && card.isBestow()) {
                this.game.queueStep(new BestowPrompt(this.game, this, card));
            }

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
            if(card.controller !== this) {
                card.controller.allCards = _(card.controller.allCards.reject(c => c === card));
                this.allCards.push(card);
            }
            card.controller = this;
            card.wasAmbush = (playingType === 'ambush');

            if(!dupeCard && !isSetupAttachment) {
                card.applyPersistentEffects();
            }

            if(this.game.currentPhase !== 'setup' && card.isBestow()) {
                this.game.queueStep(new BestowPrompt(this.game, this, card));
            }

            this.game.raiseEvent('onCardEntersPlay', { card: card, playingType: playingType, originalLocation: originalLocation });
        }
    }

    setupDone() {
        if(this.hand.size() < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.size());
        }

        var processedCards = _([]);

        this.cardsInPlay.each(card => {
            card.facedown = false;

            if(!card.isUnique()) {
                processedCards.push(card);
                return;
            }

            var duplicate = this.findCardByName(processedCards, card.name);

            if(duplicate) {
                duplicate.addDuplicate(card);
            } else {
                processedCards.push(card);
            }

        });

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

        this.challenges.reset();

        this.challengerLimit = 0;
        this.drawPhaseCards = DrawPhaseCards;

        this.cardsInPlay.each(card => {
            card.new = false;
        });
    }

    flipPlotFaceup() {
        this.selectedPlot.flipFaceup();
        this.moveCard(this.selectedPlot, 'active plot');
        this.selectedPlot.applyPersistentEffects();

        this.game.raiseEvent('onCardEntersPlay', { card: this.activePlot, playingType: 'plot' });

        this.selectedPlot = undefined;
    }

    recyclePlots() {
        if(this.plotDeck.isEmpty()) {
            this.plotDiscard.each(plot => {
                this.moveCard(plot, 'plot deck');
            });
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
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginMarshal() {
        this.game.addGold(this, this.getTotalIncome());
        this.game.addMessage('{0} collects {1} gold', this, this.getTotalIncome());

        this.game.raiseEvent('onIncomeCollected', { player: this });

        this.limitedPlayed = 0;
    }

    hasUnmappedAttachments() {
        return this.cardsInPlay.any(card => {
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

    attach(player, attachment, card, playingType) {
        if(!card || !attachment) {
            return;
        }

        if(!this.canAttach(attachment, card)) {
            return;
        }

        let originalLocation = attachment.location;
        let originalParent = attachment.parent;

        attachment.owner.removeCardFromPile(attachment);
        if(originalParent) {
            originalParent.removeAttachment(attachment);
        }
        attachment.moveTo('play area', card);
        card.attachments.push(attachment);

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
        });

        if(originalLocation !== 'play area') {
            this.game.raiseEvent('onCardEntersPlay', { card: attachment, playingType: playingType, originalLocation: originalLocation });
        }

        this.game.raiseEvent('onCardAttached', { card: attachment, parent: card });
    }

    showDrawDeck() {
        this.showDeck = true;
    }

    isValidDropCombination(card, target) {
        const PlotCardTypes = ['plot'];
        const DrawDeckCardTypes = ['attachment', 'character', 'event', 'location'];
        const AllowedTypesForPile = {
            'active plot': PlotCardTypes,
            'dead pile': ['character'],
            'discard pile': DrawDeckCardTypes,
            'draw deck': DrawDeckCardTypes,
            'hand': DrawDeckCardTypes,
            'out of game': DrawDeckCardTypes.concat(PlotCardTypes),
            'play area': ['attachment', 'character', 'location'],
            'plot deck': PlotCardTypes,
            'revealed plots': PlotCardTypes,
            // Agenda specific piles
            'scheme plots': PlotCardTypes,
            'conclave': DrawDeckCardTypes
        };

        let allowedTypes = AllowedTypesForPile[target];

        if(!allowedTypes) {
            return false;
        }

        return allowedTypes.includes(card.getType());
    }

    getSourceList(source) {
        switch(source) {
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
                return _([]);
            case 'plot deck':
                return this.plotDeck;
            case 'revealed plots':
                return this.plotDiscard;
            case 'out of game':
                return this.outOfGamePile;
            // Agenda specific piles
            case 'scheme plots':
                return this.schemePlots;
            case 'conclave':
                return this.conclavePile;
        }
    }

    updateSourceList(source, targetList) {
        switch(source) {
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
            // Agenda specific piles
            case 'scheme plots':
                this.schemePlots = targetList;
                break;
            case 'conclave':
                this.conclavePile = targetList;
        }
    }

    drop(card, source, target) {
        if(!card) {
            return false;
        }

        if(!this.isValidDropCombination(card, target)) {
            return false;
        }

        if(source === target) {
            return false;
        }

        if(card.controller !== this) {
            return false;
        }

        if(target === 'play area') {
            this.putIntoPlay(card);
        } else {
            if(target === 'dead pile' && card.location === 'play area') {
                this.killCharacter(card, false);
                return true;
            }

            if(target === 'discard pile') {
                this.discardCard(card, false);
                return true;
            }

            this.moveCard(card, target);
        }

        return true;
    }

    promptForAttachment(card, playingType) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    beginChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    trackChallenge(challenge) {
        this.challenges.track(challenge);
    }

    getParticipatedChallenges() {
        return this.challenges.getChallenges();
    }

    resetForChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    sacrificeCard(card) {
        this.game.applyGameAction('sacrifice', card, card => {
            this.game.raiseEvent('onSacrificed', { player: this, card: card }, event => {
                event.cardStateWhenSacrificed = card.createSnapshot();
                this.moveCard(card, 'discard pile');
            });
        });
    }

    discardCard(card, allowSave = true) {
        this.discardCards([card], allowSave);
    }

    discardCards(cards, allowSave = true, callback = () => true) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                cards: cards,
                allowSave: allowSave,
                automaticSaveWithDupe: true,
                originalLocation: cards[0].location
            };
            this.game.raiseEvent('onCardsDiscarded', params, event => {
                _.each(event.cards, card => {
                    this.doSingleCardDiscard(card, allowSave);
                });
                this.game.queueSimpleStep(() => {
                    callback(event.cards);
                });
            });
        });
    }

    doSingleCardDiscard(card, allowSave = true) {
        var params = {
            player: this,
            card: card,
            allowSave: allowSave,
            automaticSaveWithDupe: true,
            originalLocation: card.location
        };
        this.game.raiseEvent('onCardDiscarded', params, event => {
            this.moveCard(event.card, 'discard pile');
        });
    }

    returnCardToHand(card, allowSave = true) {
        this.game.applyGameAction('returnToHand', card, card => {
            this.moveCard(card, 'hand', { allowSave: allowSave });
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

    taxation() {
        this.gold = 0;
    }

    getTotalPower() {
        var power = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getPower();
        }, this.faction.power);

        return power;
    }

    removeAttachment(attachment, allowSave = true) {
        if(attachment.isTerminal()) {
            attachment.owner.moveCard(attachment, 'discard pile', { allowSave: allowSave });
        } else {
            attachment.owner.moveCard(attachment, 'hand', { allowSave: allowSave });
        }
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        this.faction.cardData = deck.faction;
        this.faction.cardData.name = deck.faction.name;
        this.faction.cardData.code = deck.faction.value;
        this.faction.cardData.type_code = 'faction';
        this.faction.cardData.strength = 0;
    }

    moveCard(card, targetLocation, options = {}, callback) {
        let targetPile = this.getSourceList(targetLocation);

        options = _.extend({ allowSave: false, bottom: false, isDupe: false }, options);

        if(!targetPile) {
            return;
        }

        if(card.location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation);
                return;
            }

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

        if(!targetPile || targetPile.contains(card)) {
            return;
        }

        if(card.location === 'play area') {
            card.attachments.each(attachment => {
                this.removeAttachment(attachment, false);
            });

            while(card.dupes.size() > 0 && targetLocation !== 'play area') {
                this.removeDuplicate(card, true);
            }

            if(card.parent) {
                card.parent.removeAttachment(card);
            }
        }

        if(['play area', 'active plot'].includes(card.location)) {
            card.leavesPlay();
        }

        if(card.location === 'active plot') {
            this.game.raiseEvent('onCardLeftPlay', { player: this, card: card });
        }

        if(card.parent) {
            card.parent.removeAttachment(card);
        }

        card.moveTo(targetLocation);

        if(targetLocation === 'active plot') {
            this.activePlot = card;
        } else if(targetLocation === 'draw deck' && !options.bottom) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(['dead pile', 'discard pile'].includes(targetLocation)) {
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation, player: this });
        }
    }

    kneelCard(card) {
        if(card.kneeled) {
            return;
        }

        this.game.applyGameAction('kneel', card, card => {
            card.kneeled = true;

            this.game.raiseEvent('onCardKneeled', { player: this, card: card });
        });
    }

    standCard(card) {
        if(!card.kneeled) {
            return;
        }

        this.game.applyGameAction('stand', card, card => {
            card.kneeled = false;

            this.game.raiseEvent('onCardStood', { player: this, card: card });
        });
    }

    removeDuplicate(card, force = false) {
        if(card.dupes.isEmpty()) {
            return false;
        }

        var dupe = card.removeDuplicate(force);
        if(!dupe) {
            return false;
        }

        dupe.moveTo('discard pile');
        dupe.owner.discardPile.push(dupe);

        return true;
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            let oldController = card.controller;
            oldController.removeCardFromPile(card);

            oldController.allCards = _(oldController.allCards.reject(c => c === card));
            this.allCards.push(card);
            card.controller = card.owner;

            return;
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

        return Math.max(this.activePlot.getReserve(), this.minReserve);
    }

    getClaim() {
        return this.activePlot ? this.activePlot.getClaim() : 0;
    }

    isBelowReserve() {
        return this.hand.size() <= this.getTotalReserve();
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

    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
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

    getStats(isActivePlayer) {
        return {
            claim: this.getClaim(),
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            reserve: this.getTotalReserve(),
            totalPower: this.getTotalPower()
        };
    }

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            activePlot: this.activePlot ? this.activePlot.getSummary(activePlayer) : undefined,
            agenda: this.agenda ? this.agenda.getSummary(activePlayer) : undefined,
            cardPiles: {
                bannerCards: this.getSummaryForCardList(this.bannerCards, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conclavePile: this.getSummaryForCardList(this.conclavePile, activePlayer, true),
                deadPile: this.getSummaryForCardList(this.deadPile, activePlayer).reverse(),
                discardPile: this.getSummaryForCardList(this.discardPile, activePlayer).reverse(),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                outOfGamePile: this.getSummaryForCardList(this.outOfGamePile, activePlayer, false),
                plotDeck: this.getSummaryForCardList(this.plotDeck, activePlayer, true),
                plotDiscard: this.getSummaryForCardList(this.plotDiscard, activePlayer),
                schemePlots: this.getSummaryForCardList(this.schemePlots, activePlayer, true)
            },
            disconnected: this.disconnected,
            faction: this.faction.getSummary(activePlayer),
            firstPlayer: this.firstPlayer,
            id: this.id,
            keywordSettings: this.keywordSettings,
            left: this.left,
            numDrawCards: this.drawDeck.size(),
            name: this.name,
            numPlotCards: this.plotDeck.size(),
            phase: this.phase,
            plotSelected: !!this.selectedPlot,
            promptedActionWindows: this.promptedActionWindows,
            stats: this.getStats(isActivePlayer),
            timerSettings: this.timerSettings,
            title: this.title ? this.title.getSummary(activePlayer) : undefined,
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.cardPiles.drawDeck = this.getSummaryForCardList(this.drawDeck, activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
