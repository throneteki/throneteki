const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseParticipantsPrompt = require('./ChooseParticipantsPrompt');
const ChooseStealthTargets = require('./choosestealthtargets.js');
const ClaimPrompt = require('./ClaimPrompt');
const ActionWindow = require('../actionwindow.js');
const KeywordWindow = require('../keywordwindow.js');
const {Flags} = require('../../Constants');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.declaredAttackers = [];
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.recalculateEffects()),
            new SimpleStep(this.game, () => this.announceChallenge()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            new SimpleStep(this.game, () => this.recalculateEffects()),
            new SimpleStep(this.game, () => this.chooseStealthTargets()),
            new SimpleStep(this.game, () => this.initiateChallenge()),
            new SimpleStep(this.game, () => this.announceAttackerStrength()),
            new ActionWindow(this.game, 'After attackers declared', 'attackersDeclared'),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderStrength()),
            new ActionWindow(this.game, 'After defenders declared', 'defendersDeclared'),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.challengeBonusPower()),
            new SimpleStep(this.game, () => this.beforeClaim()),
            () => new KeywordWindow(this.game, this.challenge),
            new SimpleStep(this.game, () => this.atEndOfChallenge())
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
        this.game.queueStep(new ChooseParticipantsPrompt(this.game, this.challenge.attackingPlayer, {
            attacking: true,
            challengeType: this.challenge.challengeType,
            gameAction: 'declareAsAttacker',
            mustBeDeclaredOption: Flags.challenges.mustBeDeclaredAsAttacker,
            limitsProperty: 'attackerLimits',
            activePromptTitle: 'Select challenge attackers',
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            messages: {
                autoDeclareSingular: '{0} is automatically declared as an attacker',
                autoDeclarePlural: '{0} are automatically declared as attackers',
                notEnoughSingular: '{0} did not declare at least {1} attacker but had characters to do so',
                notEnoughPlural: '{0} did not declare at least {1} attackers but had characters to do so'
            },
            onSelect: attackers => this.chooseAttackers(attackers)
        }));
    }

    chooseAttackers(attackers) {
        if(attackers.length === 0) {
            this.challenge.cancelChallenge();
            return;
        }

        this.declaredAttackers = attackers;
        this.attackersToKneel = [];
        this.challenge.declareAttackers(attackers);

        for(let card of attackers) {
            if(!card.kneeled && card.kneelsAsAttacker(this.challenge.challengeType)) {
                this.game.applyGameAction('kneel', card, card => {
                    card.kneeled = true;
                    this.attackersToKneel.push(card);
                });
            }
        }

        return true;
    }

    chooseStealthTargets() {
        const stealthAttackers = this.declaredAttackers.filter(card => card.isStealth());
        this.game.queueStep(new ChooseStealthTargets(this.game, this.challenge, stealthAttackers));
    }

    initiateChallenge() {
        this.challenge.initiateChallenge();

        let events = [
            { name: 'onChallengeInitiated', params: { challenge: this.challenge } },
            { name: 'onAttackersDeclared', params: { challenge: this.challenge } }
        ];

        let attackerEvents = this.declaredAttackers.map(card => {
            return { name: 'onDeclaredAsAttacker', params: { card: card, challenge: this.challenge } };
        });

        let kneelEvents = this.attackersToKneel.map(card => {
            return { name: 'onCardKneeled', params: { player: this.challenge.attackingPlayer, card: card } };
        });

        let stealthEvents = this.challenge.stealthData.map(stealth => {
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

        this.game.queueStep(new ChooseParticipantsPrompt(this.game, this.challenge.defendingPlayer, {
            attacking: false,
            challengeType: this.challenge.challengeType,
            gameAction: 'declareAsDefender',
            mustBeDeclaredOption: Flags.challenges.mustBeDeclaredAsDefender,
            limitsProperty: 'defenderLimits',
            activePromptTitle: 'Select defenders',
            waitingPromptTitle: 'Waiting for opponent to defend',
            messages: {
                autoDeclareSingular: '{0} is automatically declared as a defender',
                autoDeclarePlural: '{0} are automatically declared as defenders',
                notEnoughSingular: '{0} did not declare at least {1} defender but had characters to do so',
                notEnoughPlural: '{0} did not declare at least {1} defenders but had characters to do so'
            },
            onSelect: defenders => this.chooseDefenders(defenders)
        }));
    }

    chooseDefenders(defenders) {
        let defendersToKneel = [];
        this.challenge.addDefenders(defenders);

        for(let card of defenders) {
            if(!card.kneeled && card.kneelsAsDefender(this.challenge.challengeType)) {
                this.game.applyGameAction('kneel', card, card => {
                    card.kneeled = true;
                    defendersToKneel.push(card);
                });
            }
        }

        let events = [
            { name: 'onDefendersDeclared', params: { challenge: this.challenge } }
        ];

        let defenderEvents = defenders.map(card => {
            return { name: 'onDeclaredAsDefender', params: { card: card } };
        });

        let kneelEvents = defendersToKneel.map(card => {
            return { name: 'onCardKneeled', params: { player: this.challenge.defendingPlayer, card: card } };
        });

        this.game.raiseAtomicEvent(events.concat(defenderEvents).concat(kneelEvents));

        defendersToKneel = undefined;

        return true;
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

    challengeBonusPower() {
        if(this.challenge.isUnopposed() && this.challenge.isAttackerTheWinner()) {
            if(this.challenge.winner.hasFlag(Flags.player.cannotGainChallengeBonus)) {
                this.game.addMessage('{0} won the challenge unopposed but cannot gain challenge bonuses', this.challenge.winner);
            } else if(!this.challenge.winner.canGainFactionPower()) {
                this.game.addMessage('{0} won the challenge unopposed but cannot gain power for their faction', this.challenge.winner);
            } else {
                this.game.raiseEvent('onUnopposedGain', { challenge: this.challenge }, () => {
                    this.game.addMessage('{0} gains 1 power from an unopposed challenge', this.challenge.winner);
                    this.game.addPower(this.challenge.winner, 1);
                });
            }
        }

        if(this.challenge.isRivalWin()) {
            this.game.addMessage('{0} gains 1 power from winning against their rival {1}', this.challenge.winner, this.challenge.loser);
            this.challenge.winner.markRivalBonusGained(this.challenge.loser);
            this.game.addPower(this.challenge.winner, 1);
        }
    }

    beforeClaim() {
        if(!this.challenge.isAttackerTheWinner()) {
            return;
        }

        if(this.challenge.isSinglePlayer) {
            return;
        }

        this.game.queueStep(new ClaimPrompt(this.game, this.challenge));
    }

    atEndOfChallenge() {
        this.game.raiseEvent('onAtEndOfChallenge', { challenge: this.challenge });
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method, promptId) {
        return this.pipeline.handleMenuCommand(player, arg, method, promptId);
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

    cancelChallengeResolution() {
        this.challenge.cancelChallenge();
        this.pipeline.clear();
    }
}

module.exports = ChallengeFlow;
