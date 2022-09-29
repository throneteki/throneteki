const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseParticipantsPrompt = require('./ChooseParticipantsPrompt');
const ChooseAssaultTargets = require('./ChooseAssaultTargets.js');
const ChooseStealthTargets = require('./ChooseStealthTargets.js');
const ClaimPrompt = require('./ClaimPrompt');
const ActionWindow = require('../actionwindow.js');
const KeywordWindow = require('../keywordwindow.js');
const InitiateChallenge = require('../../GameActions/InitiateChallenge');
const DeclareDefenders = require('../../GameActions/DeclareDefenders.js');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.pipeline = new GamePipeline();

        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.recalculateEffects()),
            new SimpleStep(this.game, () => this.announceChallenge()),
            new SimpleStep(this.game, () => this.preAttackersPromptForDefenders()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            new SimpleStep(this.game, () => this.recalculateEffects()),
            new SimpleStep(this.game, () => this.chooseStealthTargets()),
            new SimpleStep(this.game, () => this.chooseAssaultTargets()),
            new SimpleStep(this.game, () => this.initiateChallenge()),
            new ActionWindow(this.game, 'After attackers declared', 'attackersDeclared'),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.declareDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderStrength()),
            new ActionWindow(this.game, 'After defenders declared', 'defendersDeclared'),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.challengeBonusPower()),
            new SimpleStep(this.game, () => this.beforeClaim()),
            () => new KeywordWindow(this.game, this.challenge),
            new SimpleStep(this.game, () => this.atEndOfChallenge())
        ]);

        this.attackerPrompt = new ChooseParticipantsPrompt(this.game, this.challenge.attackingPlayer, {
            attacking: true,
            challengeType: this.challenge.challengeType,
            cannotCancel: this.challenge.declareDefendersFirst,
            gameAction: 'declareAsAttacker',
            mustBeDeclaredOption: 'mustBeDeclaredAsAttacker',
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
        });

        this.defenderPrompt = new ChooseParticipantsPrompt(this.game, this.challenge.defendingPlayer, {
            attacking: false,
            challengeType: this.challenge.challengeType,
            gameAction: 'declareAsDefender',
            mustBeDeclaredOption: 'mustBeDeclaredAsDefender',
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
        });
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
        let defendersFirstMessage = this.challenge.declareDefendersFirst ? ', with defenders being declared before they declare attackers' : '';
        this.game.addMessage('{0} is initiating a {1} challenge' + defendersFirstMessage, this.challenge.attackingPlayer, this.challenge.challengeType);
    }

    promptForAttackers() {
        this.game.queueStep(this.attackerPrompt);
        return;
    }

    chooseAttackers(attackers) {
        if(attackers.length === 0) {
            this.cancelChallenge();
            return;
        }

        this.challenge.declareAttackers(attackers);

        return true;
    }

    chooseStealthTargets() {
        const stealthAttackers = this.challenge.declaredAttackers.filter(card => card.isStealth());
        this.game.queueStep(new ChooseStealthTargets(this.game, this.challenge, stealthAttackers));
    }

    chooseAssaultTargets() {
        const assaultAttackers = this.challenge.declaredAttackers.filter(card => card.isAssault());
        this.game.queueStep(new ChooseAssaultTargets(this.game, this.challenge, assaultAttackers));
    }

    initiateChallenge() {
        this.game.resolveGameAction(InitiateChallenge, { challenge: this.challenge });
    }

    preAttackersPromptForDefenders() {
        if(this.challenge.isSinglePlayer || !this.challenge.declareDefendersFirst) {
            return;
        }

        if(!this.challenge.attackingPlayer.anyCardsInPlay(card => this.attackerPrompt.canParticipate(card))) {
            this.game.promptWithMenu(this.challenge.attackingPlayer, this, {
                activePrompt: {
                    menuTitle: 'You do not control enough elibile characters to legally initiate this challenge. Do you want to continue with defenders being declared anyway?',
                    buttons: [
                        { text: 'Yes', method: 'illegallyPromptForDefenders' },
                        { text: 'No', method: 'cancelChallenge' }
                    ]
                },
                source: this
            });
        } else {
            this.game.queueStep(this.defenderPrompt);
        }
    }

    illegallyPromptForDefenders() {
        this.game.addAlert('danger', '{0} does not control enough elibile characters to legally initiate this challenge, but has chosen to continue with declaring defenders anyway', this.challenge.attackingPlayer);
        this.game.queueStep(this.defenderPrompt);
        return true;
    }

    promptForDefenders() {
        if(this.challenge.isSinglePlayer || this.challenge.declareDefendersFirst) {
            return;
        }

        this.game.queueStep(this.defenderPrompt);
    }

    chooseDefenders(defenders) {
        this.challenge.addDefenders(defenders);

        if(this.challenge.declareDefendersFirst) {
            if(defenders.length > 0) {
                this.game.addMessage('{0} has chosen to defend with {1}', this.challenge.defendingPlayer, defenders);
            } else {
                this.game.addMessage('{0} has not chosen any defenders', this.challenge.defendingPlayer);
            }
        }
        return true;
    }

    declareDefenders() {
        if(this.challenge.declareDefendersFirst) {
            this.game.addMessage('{0} cannot declare defenders after attackers are declared for this challenge', this.challenge.defendingPlayer);
            return;
        }

        this.game.raiseEvent(DeclareDefenders.createEvent({ cards: this.challenge.defenders, challenge: this.challenge }));
    }

    announceDefenderStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();

        if(this.challenge.declareDefendersFirst) {
            this.game.addMessage('{0} is defending with strength {1}', this.challenge.defendingPlayer, this.challenge.defenderStrength);
        } else if(this.challenge.defenderStrength > 0 || this.challenge.defenders.length > 0) {
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
            if(this.challenge.winner.cannotGainChallengeBonus) {
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

    cancelChallenge() {
        this.challenge.cancelChallenge();
    }

    cancelChallengeResolution() {
        this.challenge.cancelChallenge();
        this.pipeline.clear();
    }
}

module.exports = ChallengeFlow;
