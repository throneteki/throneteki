const _ = require('underscore');

class Challenge {
    constructor(attackingPlayer, defendingPlayer, challengeType) {
        this.attackingPlayer = attackingPlayer;
        this.defendingPlayer = defendingPlayer;
        this.challengeType = challengeType;
        this.attackers = [];
        this.defenders = [];
    }

    resetCards() {
        this.attackingPlayer.resetForChallenge();
        this.defendingPlayer.resetForChallenge();
    }

    initiateChallenge() {
        this.attackingPlayer.initiateChallenge(this.challengeType);
    }

    addAttackers(attackers) {
        this.attackers = attackers;
        this.markAsParticipating(attackers);

        // TODO: Remove duplicated logic.
        this.attackingPlayer.cardsInChallenge = _(attackers);
    }

    addDefenders(defenders) {
        this.defenders = defenders;
        this.markAsParticipating(defenders);

        // TODO: Remove duplicated logic.
        this.defendingPlayer.cardsInChallenge = _(defenders);
    }

    removeFromChallenge(card) {
        this.attackers = _.reject(this.attackers, c => c === card);
        this.defenders = _.reject(this.defenders, c => c === card);
        this.calculateStrength();

        // TODO: Remove duplicated logic
        this.attackingPlayer.cardsInChallenge = _(this.attackers);
        this.defendingPlayer.cardsInChallenge = _(this.defenders);
    }

    markAsParticipating(cards) {
        _.each(cards, card => {
            card.kneeled = true;
        });
    }

    calculateStrength() {
        this.attackerStrength = this.calculateStrengthFor(this.attackers);
        this.defenderStrength = this.calculateStrengthFor(this.defenders);

        // TODO: Remove duplicated logic
        this.attackingPlayer.challengeStrength = this.attackerStrength;
        this.defendingPlayer.challengeStrength = this.defenderStrength;
    }

    calculateStrengthFor(cards) {
        return _.reduce(cards, (sum, card) => {
            return sum + card.getStrength();
        }, 0);
    }

    getStealthAttackers() {
        return _.filter(this.attackers, card => card.needsStealthTarget());
    }

    determineWinner() {
        this.calculateStrength();
        if(this.attackerStrength >= this.defenderStrength) {
            this.loser = this.defendingPlayer;
            this.winner = this.attackingPlayer;
        } else {
            this.loser = this.attackingPlayer;
            this.winner = this.defendingPlayer;
        }

        this.winner.winChallenge(this.challengeType);
        this.loser.loseChallenge(this.challengeType);
        this.strengthDifference = this.winner.challengeStrength - this.loser.challengeStrength;
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    isUnopposed() {
        return this.defenderStrength <= 0;
    }

    getClaim() {
        var claim = this.winner.activePlot.getClaim();
        claim = this.winner.modifyClaim(this.winner, this.challengeType, claim);

        if(this.loser) {
            claim = this.loser.modifyClaim(this.winner, this.challengeType, claim);
        }

        return claim;
    }
}

module.exports = Challenge;
