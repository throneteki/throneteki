const _ = require('underscore');
const Player = require('./player.js');
const EventRegistrar = require('./eventregistrar.js');
const Settings = require('../settings.js');
const ChallengeMatcher = require('./ChallengeMatcher');

class Challenge {
    constructor(game, properties) {
        this.game = game;
        this.attackingPlayer = properties.attackingPlayer;
        this.isSinglePlayer = !properties.defendingPlayer;
        this.defendingPlayer = properties.defendingPlayer || this.singlePlayerDefender();
        this.challengeType = properties.challengeType;
        this.number = properties.number;
        this.attackers = [];
        this.attackerStrength = 0;
        this.attackerStrengthModifier = 0;
        this.defenders = [];
        this.defenderStrength = 0;
        this.defenderStrengthModifier = 0;
        this.stealthData = [];
        this.events = new EventRegistrar(game, this);
        this.registerEvents(['onCardLeftPlay']);
    }

    singlePlayerDefender() {
        let dummyPlayer = new Player('', Settings.getUserWithDefaultsSet({ name: 'Dummy Player' }), false, this.game);
        dummyPlayer.initialise();
        dummyPlayer.startPlotPhase();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForChallenge();
        this.defendingPlayer.resetForChallenge();
    }

    initiateChallenge() {
        this.attackingPlayer.trackChallenge(this);
        this.defendingPlayer.trackChallenge(this);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.markAsParticipating(attackers);
        this.calculateStrength();
    }

    addAttacker(attacker) {
        this.attackers.push(attacker);
        this.markAsParticipating([attacker]);
        this.calculateStrength();
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.markAsParticipating(defenders);
        this.calculateStrength();
    }

    addDefender(defender) {
        this.defenders.push(defender);
        this.markAsParticipating([defender]);
        this.calculateStrength();
    }

    removeFromChallenge(card) {
        if(!this.isParticipating(card)) {
            return;
        }

        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);

        card.inChallenge = false;

        this.calculateStrength();

        this.game.raiseEvent('onRemovedFromChallenge', { card: card });
    }

    markAsParticipating(cards) {
        _.each(cards, card => {
            card.inChallenge = true;
            card.markAsDirty();
        });
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
        return _.any(participants, predicate);
    }

    hasSingleParticipant(player) {
        if(this.attackingPlayer === player) {
            return this.attackers.length === 1;
        }

        return this.defenders.length === 1;
    }

    getNumberOfParticipants(predicate = () => true) {
        let participants = this.attackers.concat(this.defenders);
        return _.reduce(participants, (count, card) => {
            if(predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    addStealthChoice(source, target) {
        this.stealthData.push({ source: source, target: target });
    }

    calculateStrength() {
        if(this.winnerDetermined) {
            return;
        }

        this.attackerStrength = this.calculateStrengthFor(this.attackers) + this.attackerStrengthModifier;
        this.defenderStrength = this.calculateStrengthFor(this.defenders) + this.defenderStrengthModifier;
    }

    calculateStrengthFor(cards) {
        return _.reduce(cards, (sum, card) => {
            if(card.challengeOptions.contains('doesNotContributeStrength')) {
                return sum;
            }

            return sum + card.getStrength();
        }, 0);
    }

    modifyAttackerStrength(value) {
        this.attackerStrengthModifier += value;
        this.calculateStrength();
    }

    modifyDefenderStrength(value) {
        this.defenderStrengthModifier += value;
        this.calculateStrength();
    }

    addParticipantToSide(player, card) {
        if(this.game.currentChallenge.attackingPlayer === player) {
            this.game.currentChallenge.addAttacker(card);
        } else {
            this.game.currentChallenge.addDefender(card);
        }
    }

    getStealthAttackers() {
        return _.filter(this.attackers, card => card.needsStealthTarget());
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

        return _.chain(noWinnerRules)
            .map(rule => ({ noWinner: !!rule.condition(), message: rule.message }))
            .find(match => match.noWinner)
            .value() || { noWinner: false };
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
        _.each(this.attackers, card => card.inChallenge = false);
        _.each(this.defenders, card => card.inChallenge = false);
    }

    cancelChallenge() {
        this.cancelled = true;

        this.resetCards();

        this.game.addMessage('{0}\'s {1} challenge is cancelled', this.attackingPlayer, this.challengeType);
    }

    isMatch(matchers) {
        return ChallengeMatcher.isMatch(this, matchers);
    }
}

module.exports = Challenge;
