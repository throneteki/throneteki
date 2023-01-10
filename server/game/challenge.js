const Player = require('./player.js');
const EventRegistrar = require('./eventregistrar.js');
const Settings = require('../settings.js');
const ChallengeMatcher = require('./ChallengeMatcher');

class Challenge {
    constructor(game, properties) {
        this.game = game;
        this.initiatingPlayer = properties.attackingPlayer;
        this.attackingPlayer = properties.attackingPlayer;
        this.isSinglePlayer = !properties.defendingPlayer;
        this.defendingPlayer = properties.defendingPlayer || this.singlePlayerDefender();
        this.initiatedAgainstPlayer = this.defendingPlayer;
        this.isInitiated = false || properties.isInitiated;
        this.initiatedChallengeType = properties.challengeType;
        this.challengeType = properties.challengeType;
        this.declareDefendersFirst = false;
        this.number = properties.number;
        this.attackers = [];
        this.declaredAttackers = [];
        this.attackerContributions = [];
        this.attackerStrength = 0;
        this.defenders = [];
        this.defenderContributions = [];
        this.defenderStrength = 0;
        this.stealthData = [];
        this.assaultData = [];
        this.events = new EventRegistrar(game, this);
        this.registerEvents(['onCardLeftPlay']);
    }

    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ name: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        dummyPlayer.resetForStartOfRound();
        dummyPlayer.isFake = true;
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForChallenge();
        this.defendingPlayer.resetForChallenge();
    }

    initiateChallenge() {
        this.attackingPlayer.trackChallenge(this);
        this.defendingPlayer.trackChallenge(this);
        this.isInitiated = true;
    }

    declareAttackers(attackers) {
        this.addAttackers(attackers);
        this.declaredAttackers = this.declaredAttackers.concat(attackers);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.attackers.forEach(attacker => this.addContributionToAttack(attacker, 'participation'));
        this.markAsParticipating(attackers);
        this.calculateStrength();
    }

    addAttacker(attacker) {
        this.addAttackers([attacker]);
    }

    addContributionToAttack(card, type, amount) {
        // Clearing existing "its STR" contributions
        if(!amount) {
            this.clearDynamicContributions(card);
        }
        
        card.isContributing = true;
        this.attackerContributions.push({ card, type, amount });
    }

    removeContributionToAttack(card, type, amount) {
        let contribution = this.attackerContributions.find(c => c.card === card && c.type === type && c.amount === amount);
        if(contribution) {
            this.attackerContributions.splice(this.attackerContributions.indexOf(contribution), 1);
            card.isContributing = this.isContributingSTR(card);
        }
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.defenders.forEach(defender => this.addContributionToDefence(defender, 'participation'));
        this.markAsParticipating(defenders);
        this.calculateStrength();
    }

    addDefender(defender) {
        this.addDefenders([defender]);
    }

    addContributionToDefence(card, type, amount) {
        // Clearing existing "its STR" contributions
        if(!amount) {
            this.clearDynamicContributions(card);
        }

        card.isContributing = true;
        this.defenderContributions.push({ card, type, amount });
    }

    removeContributionToDefence(card, type, amount) {
        let contribution = this.defenderContributions.find(c => c.card === card && c.type === type && c.amount === amount);
        if(contribution) {
            this.defenderContributions.splice(this.defenderContributions.indexOf(contribution), 1);
            card.isContributing = this.isContributingSTR(card);
        }
    }

    addContributeSTRTowards(player, card, amount) {
        if(this.attackingPlayer === player) {
            this.addContributionToAttack(card, 'effect', amount);
        } else if(this.defendingPlayer === player) {
            this.addContributionToDefence(card, 'effect', amount);
        }
        this.calculateStrength();
    }

    removeContributeSTRTowards(player, card, amount) {
        if(this.attackingPlayer === player) {
            this.removeContributionToAttack(card, 'effect', amount);
        } else if(this.defendingPlayer === player) {
            this.removeContributionToDefence(card, 'effect', amount);
        }
        this.calculateStrength();
    }

    isContributingSTR(card, type) {
        return this.attackerContributions.some(c => c.card === card && (!type || c.type === type))
            || this.defenderContributions.some(c => c.card === card && (!type || c.type === type));
    }

    clearDynamicContributions(card) {
        this.attackerContributions = this.attackerContributions.filter(ac => ac.card !== card || !!ac.amount);
        this.defenderContributions = this.defenderContributions.filter(dc => dc.card !== card || !!dc.amount);
    }

    removeFromChallenge(card) {
        if(!this.isParticipating(card)) {
            return;
        }
        const eventProps = {
            card,
            challenge: this,
            isAttacking: this.isAttacking(card),
            isDeclared: this.isDeclared(card),
            isDefending: this.isDefending(card)
        };

        this.attackers = this.attackers.filter(c => c !== card);
        this.declaredAttackers = this.declaredAttackers.filter(c => c !== card);
        this.attackerContributions = this.attackerContributions.filter(c => c.card !== card || c.type !== 'participation');
        this.defenders = this.defenders.filter(c => c !== card);
        this.defenderContributions = this.defenderContributions.filter(c => c.card !== card || c.type !== 'participation');

        card.inChallenge = false;

        this.calculateStrength();

        this.game.raiseEvent('onRemovedFromChallenge', eventProps);
    }

    markAsParticipating(cards) {
        for(let card of cards) {
            card.inChallenge = true;
            card.markAsDirty();
        }
    }

    isDeclared(card) {
        return this.declaredAttackers.includes(card);
    }

    isAttacking(card) {
        return this.attackers.includes(card);
    }

    isDefending(card) {
        return this.defenders.includes(card);
    }

    isParticipating(card) {
        return this.isAttacking(card) || this.isDefending(card);
    }

    getParticipants() {
        return this.attackers.concat(this.defenders);
    }

    anyParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return participants.some(predicate);
    }

    hasSingleParticipant(player) {
        if(this.attackingPlayer === player) {
            return this.attackers.length === 1;
        }

        return this.defenders.length === 1;
    }

    getNumberOfParticipants(predicate = () => true) {
        let participants = this.attackers.concat(this.defenders);
        return participants.reduce((count, card) => {
            if(predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    clearStealthChoices() {
        this.stealthData = [];
    }

    clearAssaultChoices() {
        this.assaultData = [];
    }

    addStealthChoice(source, target) {
        this.stealthData.push({ source: source, target: target });
    }

    addAssaultChoice(source, target) {
        this.assaultData.push({ source: source, target: target });
    }

    calculateStrength() {
        if(this.winnerDetermined) {
            return;
        }

        this.attackerStrength = this.calculateStrengthFor(this.attackerContributions);
        this.defenderStrength = this.calculateStrengthFor(this.defenderContributions);
    }

    calculateStrengthFor(contributions) {
        return contributions.reduce((sum, contribution) => {
            let card = contribution.card;
            if(!contribution.amount && card.challengeOptions && card.challengeOptions.contains('doesNotContributeStrength')) {
                return sum;
            }

            let amount = contribution.amount || card.getStrength();
            return sum + amount;
        }, 0);
    }

    addParticipantToSide(player, card) {
        if(this.attackingPlayer === player) {
            this.addAttacker(card);
        } else {
            this.addDefender(card);
        }
    }

    determineWinner() {
        this.calculateStrength();

        this.winnerDetermined = true;

        let result = this.checkNoWinnerOrLoser();
        if(result.noWinner) {
            this.noWinnerMessage = result.message;
            this.loser = undefined;
            this.winner = undefined;
            this.loserStrength = this.winnerStrength = 0;
            this.strengthDifference = 0;

            return;
        }

        if(this.attackerStrength >= this.defenderStrength) {
            this.loser = this.defendingPlayer;
            this.loserStrength = this.defenderStrength;
            this.winner = this.attackingPlayer;
            this.winnerStrength = this.attackerStrength;
        } else {
            this.loser = this.attackingPlayer;
            this.loserStrength = this.attackerStrength;
            this.winner = this.defendingPlayer;
            this.winnerStrength = this.defenderStrength;
        }

        this.strengthDifference = this.winnerStrength - this.loserStrength;
    }

    checkNoWinnerOrLoser() {
        const noWinnerRules = [
            {
                condition: () => this.attackerStrength === 0 && this.defenderStrength === 0,
                message: 'There is no winner or loser for this challenge because the attacker strength is 0'
            },
            {
                condition: () => this.attackerStrength >= this.defenderStrength && this.attackingPlayer.cannotWinChallenge,
                message: 'There is no winner or loser for this challenge because the attacker cannot win'
            },
            {
                condition: () => this.attackerStrength >= this.defenderStrength && this.attackers.length === 0,
                message: 'There is no winner or loser for this challenge because the attacker has no participants'
            },
            {
                condition: () => this.defenderStrength > this.attackerStrength && this.defendingPlayer.cannotWinChallenge,
                message: 'There is no winner or loser for this challenge because the defender cannot win'
            },
            {
                condition: () => this.defenderStrength > this.attackerStrength && this.defenders.length === 0,
                message: 'There is no winner or loser for this challenge because the defender has no participants'
            }
        ];

        return noWinnerRules
            .map(rule => ({ noWinner: !!rule.condition(), message: rule.message }))
            .find(match => match.noWinner) || { noWinner: false };
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    isUnopposed() {
        return this.loserStrength <= 0 && this.winnerStrength > 0 && this.winner === this.attackingPlayer;
    }

    isRivalWin() {
        return this.winner && this.loser && this.winner.canGainRivalBonus(this.loser);
    }

    getClaim() {
        return this.winner.getClaim();
    }

    getWinnerCards() {
        if(this.winner === this.attackingPlayer) {
            return this.attackers;
        } else if(this.winner === this.defendingPlayer) {
            return this.defenders;
        }

        return [];
    }

    getOpponentCards(player) {
        return this.attackingPlayer === player ? this.defenders : this.attackers;
    }

    onCardLeftPlay(event) {
        this.removeFromChallenge(event.card);
    }

    registerEvents(events) {
        this.events.register(events);
    }

    unregisterEvents() {
        this.events.unregisterAll();
    }

    finish() {
        for(let card of this.attackers) {
            card.inChallenge = false;
            card.isContributing = false;
        }
        for(let card of this.defenders) {
            card.inChallenge = false;
            card.isContributing = false;
        }
        this.isInitiated = false;
    }

    cancelChallenge() {
        this.cancelled = true;
        this.isInitiated = false;

        this.resetCards();

        this.game.addMessage('{0}\'s {1} challenge is cancelled', this.attackingPlayer, this.challengeType);
    }

    isMatch(matchers) {
        return ChallengeMatcher.isMatch(this, matchers);
    }
}

module.exports = Challenge;
