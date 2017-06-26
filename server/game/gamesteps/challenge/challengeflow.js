const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseStealthTargets = require('./choosestealthtargets.js');
const ApplyClaim = require('./applyclaim.js');
const ActionWindow = require('../actionwindow.js');
const GameKeywords = require('../../gamekeywords.js');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
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
            new SimpleStep(this.game, () => this.applyKeywords()),
            new SimpleStep(this.game, () => this.completeChallenge())
        ]);
    }

    resetCards() {
        this.challenge.resetCards();
    }

    announceChallenge() {
        this.game.addMessage('{0} is initiating a {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
    }

    promptForAttackers() {
        var title = 'Select challenge attackers';
        if(this.challenge.attackingPlayer.challengerLimit !== 0) {
            title += ' (limit ' + this.challenge.attackingPlayer.challengerLimit + ')';
        }

        this.game.promptForSelect(this.challenge.attackingPlayer, {
            numCards: this.challenge.attackingPlayer.challengerLimit,
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
        this.challenge.addAttackers(attackers);

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
        let stealthEvents = _.map(this.challenge.stealthData, stealth => {
            return { name: 'onBypassedByStealth', params: { challenge: this.challenge, source: stealth.source, target: stealth.target } };
        });
        this.game.raiseAtomicEvent(events.concat(stealthEvents));
    }

    announceAttackerStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        this.game.addMessage('{0} has initiated a {1} challenge with strength {2}', this.challenge.attackingPlayer, this.challenge.challengeType, this.challenge.attackerStrength);
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

        let defenderLimit = this.challenge.defendingPlayer.challengerLimit;
        let selectableLimit = defenderLimit;

        if(!_.isEmpty(this.forcedDefenders)) {
            if(this.forcedDefenders.length === defenderLimit) {
                this.game.addMessage('{0} {1} automatically declared as {2}', 
                                      this.forcedDefenders, this.forcedDefenders.length > 1 ? 'are' : 'is', this.forcedDefenders.length > 1 ? 'defenders' : 'defender');
                
                this.chooseDefenders([]);
                return;
            }

            if(this.forcedDefenders.length < defenderLimit || defenderLimit === 0) {
                this.game.addMessage('{0} {1} automatically declared as {2}', 
                                      this.forcedDefenders, this.forcedDefenders.length > 1 ? 'are' : 'is', this.forcedDefenders.length > 1 ? 'defenders' : 'defender');

                if(defenderLimit !== 0) {
                    selectableLimit -= this.forcedDefenders.length;
                }
            }
        }

        let title = 'Select defenders';
        if(defenderLimit !== 0) {
            title += ' (limit ' + defenderLimit + ')';
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
               this.mustBeDeclaredAsDefender(card);
    }

    mustBeDeclaredAsDefender(card) {
        if(_.isEmpty(this.forcedDefenders)) {
            return true;
        }

        let defenderLimit = this.challenge.defendingPlayer.challengerLimit;
        if(this.forcedDefenders.length < defenderLimit || defenderLimit === 0) {
            return !this.forcedDefenders.includes(card);
        }

        return this.forcedDefenders.includes(card);
    }

    chooseDefenders(defenders) {
        let defenderLimit = this.challenge.defendingPlayer.challengerLimit;
        if(this.forcedDefenders.length <= defenderLimit || defenderLimit === 0) {
            defenders = defenders.concat(this.forcedDefenders);
        }

        this.challenge.addDefenders(defenders);

        this.game.raiseEvent('onDefendersDeclared', this.challenge);

        return true;
    }

    announceDefenderStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        if(this.challenge.defenderStrength > 0) {
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

        this.game.raiseEvent('afterChallenge', this.challenge);

        // Only open a winner action window if a winner / loser was determined.
        if(this.challenge.winner) {
            this.game.queueStep(new ActionWindow(this.game, 'After winner determined', 'winnerDetermined'));
        }
    }

    unopposedPower() {
        if(this.challenge.isUnopposed() && this.challenge.isAttackerTheWinner()) {
            if(this.challenge.winner.cannotGainChallengeBonus) {
                this.game.addMessage('{0} won the challenge unopposed but cannot gain challenge bonuses', this.challenge.winner);
            } else {
                this.game.addMessage('{0} has gained 1 power from an unopposed challenge', this.challenge.winner);
                this.game.addPower(this.challenge.winner, 1);
            }

            this.game.raiseEvent('onUnopposedWin', this.challenge);
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

        this.game.raiseEvent('onClaimApplied', this.challenge, () => {
            this.game.queueStep(new ApplyClaim(this.game, this.challenge));
        });

        return true;
    }

    cancelClaim(player) {
        this.game.addMessage('{0} continues without applying claim', player, this);

        return true;
    }

    applyKeywords() {
        const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];
        let winnerCards = this.challenge.getWinnerCards();
        let appliedIntimidate = false;

        _.each(winnerCards, card => {
            let context = { game: this.game, challenge: this.challenge, source: card };

            _.each(challengeKeywords, keyword => {
                // It is necessary to check whether intimidate has been applied
                // here instead of in the ability class because the individual
                // keywords are resolved asynchronously but are queued up
                // synchronously here. So two intimidates could be queued when
                // only one is allowed.
                if(keyword === 'intimidate' && appliedIntimidate) {
                    return;
                }

                let ability = GameKeywords[keyword];
                if(card.hasKeyword(keyword) && ability.meetsRequirements(context)) {
                    appliedIntimidate = appliedIntimidate || (keyword === 'intimidate');
                    this.game.resolveAbility(ability, context);
                }
            });

            this.game.checkWinCondition(this.challenge.winner);
        });
    }

    completeChallenge() {
        this.game.raiseEvent('onChallengeFinished', this.challenge);

        this.resetCards();

        this.challenge.finish();
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
