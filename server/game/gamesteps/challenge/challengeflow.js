const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseStealthTargets = require('./choosestealthtargets.js');
const ApplyClaim = require('./applyclaim.js');
const ActionWindow = require('../actionwindow.js');
const KeywordWindow = require('../keywordwindow.js');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.recalculateEffects()),
            new SimpleStep(this.game, () => this.announceChallenge()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            new SimpleStep(this.game, () => this.chooseStealthTargets()),
            new SimpleStep(this.game, () => this.initiateChallenge()),
            new SimpleStep(this.game, () => this.announceAttackerStrength()),
            new ActionWindow(this.game, 'After attackers declared', 'attackersDeclared'),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderStrength()),
            new ActionWindow(this.game, 'After defenders declared', 'defendersDeclared'),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.unopposedPower()),
            new SimpleStep(this.game, () => this.beforeClaim()),
            () => new KeywordWindow(this.game, this.challenge)
        ]);
    }

    resetCards() {
        this.challenge.resetCards();
    }

    recalculateEffects() {
        // Explicit effect recalculation is needed here since conditions that
        // watch the currentChallenge property need recalculation before
        // attackers are chosen, but the challenge initiation event isn't fired
        // until after attackers have been chosen.
        this.game.effectEngine.reapplyStateDependentEffects();
    }

    announceChallenge() {
        this.game.addMessage('{0} is initiating a {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
    }

    promptForAttackers() {
        let title = 'Select challenge attackers';
        let attackerMax = this.challenge.attackingPlayer.attackerLimits.getMax();
        if(attackerMax !== 0) {
            title += ' (max ' + attackerMax + ')';
        }

        this.game.promptForSelect(this.challenge.attackingPlayer, {
            numCards: attackerMax,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            cardCondition: card => this.allowAsAttacker(card),
            onSelect: (player, attackers) => this.chooseAttackers(player, attackers),
            onCancel: () => this.challenge.cancelChallenge()
        });
    }

    allowAsAttacker(card) {
        return this.challenge.attackingPlayer === card.controller && card.canDeclareAsAttacker(this.challenge.challengeType);
    }

    chooseAttackers(player, attackers) {
        this.attackersToKneel = [];
        this.challenge.addAttackers(attackers);

        _.each(attackers, card => {
            if(!card.kneeled && !card.challengeOptions.doesNotKneelAs['attacker']) {
                this.game.applyGameAction('kneel', card, card => {
                    card.kneeled = true;
                    this.attackersToKneel.push(card);
                });
            }
        });

        return true;
    }

    chooseStealthTargets() {
        this.game.queueStep(new ChooseStealthTargets(this.game, this.challenge, this.challenge.getStealthAttackers()));
    }

    initiateChallenge() {
        this.challenge.initiateChallenge();

        let events = [
            { name: 'onChallengeInitiated', params: { challenge: this.challenge } },
            { name: 'onAttackersDeclared', params: { challenge: this.challenge } }
        ];

        let attackerEvents = _.map(this.challenge.attackers, card => {
            return { name: 'onDeclaredAsAttacker', params: { card: card } };
        });

        let kneelEvents = _.map(this.attackersToKneel, card => {
            return { name: 'onCardKneeled', params: { player: this.challenge.attackingPlayer, card: card} };
        });

        let stealthEvents = _.map(this.challenge.stealthData, stealth => {
            return { name: 'onBypassedByStealth', params: { challenge: this.challenge, source: stealth.source, target: stealth.target } };
        });

        this.game.raiseAtomicEvent(events.concat(attackerEvents).concat(stealthEvents).concat(kneelEvents));

        this.attackersToKneel = undefined;
    }

    announceAttackerStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        this.game.addMessage('{0} has initiated a {1} challenge against {2} with strength {3}', this.challenge.attackingPlayer,
            this.challenge.challengeType, this.challenge.defendingPlayer, this.challenge.attackerStrength);
    }

    promptForDefenders() {
        if(this.challenge.isSinglePlayer) {
            return;
        }

        this.forcedDefenders = this.challenge.defendingPlayer.filterCardsInPlay(card => {
            return card.getType() === 'character' &&
                card.canDeclareAsDefender(this.challenge.challengeType) &&
                card.challengeOptions.mustBeDeclaredAsDefender;
        });

        let defenderMaximum = this.challenge.defendingPlayer.defenderLimits.getMax();
        let defenderMinimum = this.challenge.defendingPlayer.defenderLimits.getMin();
        let selectableLimit = defenderMaximum;

        if(!_.isEmpty(this.forcedDefenders)) {
            if(this.forcedDefenders.length === defenderMaximum) {
                this.game.addMessage('{0} {1} automatically declared as {2}',
                    this.forcedDefenders, this.forcedDefenders.length > 1 ? 'are' : 'is', this.forcedDefenders.length > 1 ? 'defenders' : 'defender');

                this.chooseDefenders([]);
                return;
            }

            if(this.forcedDefenders.length < defenderMaximum || defenderMaximum === 0) {
                this.game.addMessage('{0} {1} automatically declared as {2}',
                    this.forcedDefenders, this.forcedDefenders.length > 1 ? 'are' : 'is', this.forcedDefenders.length > 1 ? 'defenders' : 'defender');

                if(defenderMaximum !== 0) {
                    selectableLimit -= this.forcedDefenders.length;
                }
            }
        }

        let title = 'Select defenders';
        let restrictions = [];
        if(defenderMinimum !== 0) {
            restrictions.push(`min ${defenderMinimum}`);
        }
        if(defenderMaximum !== 0) {
            restrictions.push(`max ${defenderMaximum}`);
        }
        if(restrictions.length !== 0) {
            title += ` (${restrictions.join(', ')})`;
        }

        this.game.promptForSelect(this.challenge.defendingPlayer, {
            numCards: selectableLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to defend',
            cardCondition: card => this.allowAsDefender(card),
            onSelect: (player, defenders) => this.chooseDefenders(defenders),
            onCancel: () => this.chooseDefenders([])
        });
    }

    allowAsDefender(card) {
        return this.challenge.defendingPlayer === card.controller &&
            card.canDeclareAsDefender(this.challenge.challengeType) &&
            this.mustBeDeclaredAsDefender(card) &&
            !this.challenge.isDefending(card);
    }

    mustBeDeclaredAsDefender(card) {
        if(_.isEmpty(this.forcedDefenders)) {
            return true;
        }

        let defenderMax = this.challenge.defendingPlayer.defenderLimits.getMax();
        if(this.forcedDefenders.length < defenderMax || defenderMax === 0) {
            return !this.forcedDefenders.includes(card);
        }

        return this.forcedDefenders.includes(card);
    }

    chooseDefenders(defenders) {
        let defendingPlayer = this.challenge.defendingPlayer;
        let defenderMaximum = defendingPlayer.defenderLimits.getMax();
        let defenderMinimum = defendingPlayer.defenderLimits.getMin();
        if(this.forcedDefenders.length <= defenderMaximum || defenderMaximum === 0) {
            defenders = defenders.concat(this.forcedDefenders);
        }

        if(!this.hasMetDefenderMinimum(defenders)) {
            this.game.addAlert('danger', '{0} did not declare at least {1} defender but had characters to do so', defendingPlayer, defenderMinimum);
        }

        let defendersToKneel = [];
        this.challenge.addDefenders(defenders);

        _.each(defenders, card => {
            if(!card.kneeled && !card.challengeOptions.doesNotKneelAs['defender']) {
                this.game.applyGameAction('kneel', card, card => {
                    card.kneeled = true;
                    defendersToKneel.push(card);
                });
            }
        });

        let events = [
            { name: 'onDefendersDeclared', params: { challenge: this.challenge } }
        ];

        let defenderEvents = _.map(defenders, card => {
            return { name: 'onDeclaredAsDefender', params: { card: card } };
        });

        let kneelEvents = _.map(defendersToKneel, card => {
            return { name: 'onCardKneeled', params: { player: this.challenge.defendingPlayer, card: card} };
        });

        this.game.raiseAtomicEvent(events.concat(defenderEvents).concat(kneelEvents));

        defendersToKneel = undefined;

        return true;
    }

    hasMetDefenderMinimum(defenders) {
        let defendingPlayer = this.challenge.defendingPlayer;
        let defenderMinimum = defendingPlayer.defenderLimits.getMin();

        if(defenderMinimum === 0) {
            return true;
        }

        let potentialDefenders = defendingPlayer.getNumberOfCardsInPlay(card => this.allowAsDefender(card));
        let actualMinimum = Math.min(defenderMinimum, potentialDefenders);

        return defenders.length >= actualMinimum;
    }

    announceDefenderStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        if(this.challenge.defenderStrength > 0 || this.challenge.defenders.length > 0) {
            this.game.addMessage('{0} has defended with strength {1}', this.challenge.defendingPlayer, this.challenge.defenderStrength);
        } else {
            this.game.addMessage('{0} does not defend the challenge', this.challenge.defendingPlayer);
        }
    }

    determineWinner() {
        this.challenge.determineWinner();

        if(!this.challenge.winner && !this.challenge.loser) {
            this.game.addMessage(this.challenge.noWinnerMessage);
        } else {
            this.game.addMessage('{0} won a {1} challenge {2} vs {3}',
                this.challenge.winner, this.challenge.challengeType, this.challenge.winnerStrength, this.challenge.loserStrength);
        }

        this.game.raiseEvent('afterChallenge', { challenge: this.challenge });
    }

    unopposedPower() {
        if(this.challenge.isUnopposed() && this.challenge.isAttackerTheWinner()) {
            if(this.challenge.winner.cannotGainChallengeBonus) {
                this.game.addMessage('{0} won the challenge unopposed but cannot gain challenge bonuses', this.challenge.winner);
            } else {
                this.game.raiseEvent('onUnopposedGain', { challenge: this.challenge }, () => {
                    this.game.addMessage('{0} has gained 1 power from an unopposed challenge', this.challenge.winner);
                    this.game.addPower(this.challenge.winner, 1);
                });
            }
        }
    }

    beforeClaim() {
        if(!this.challenge.isAttackerTheWinner()) {
            return;
        }

        if(this.challenge.isSinglePlayer) {
            return;
        }

        this.challenge.claim = this.challenge.getClaim();
        this.game.promptWithMenu(this.challenge.winner, this, {
            activePrompt: {
                menuTitle: 'Perform before claim actions',
                buttons: [
                    { text: 'Apply Claim', method: 'applyClaim' },
                    { text: 'Continue', method: 'cancelClaim' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to apply claim'
        });
    }

    applyClaim(player) {
        if(player !== this.challenge.winner) {
            return false;
        }

        this.game.raiseEvent('onClaimApplied', { player: this.challenge.winner, challenge: this.challenge }, () => {
            this.game.queueStep(new ApplyClaim(this.game, this.challenge));
        });

        return true;
    }

    cancelClaim(player) {
        this.game.addMessage('{0} continues without applying claim', player, this);

        return true;
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    continue() {
        return this.challenge.cancelled || this.pipeline.continue();
    }
}

module.exports = ChallengeFlow;
