const AgendaCard = require('../../agendacard.js');

class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller,
            match: card => this.game.currentChallenge.isAttacking(card),
            effect: ability.effects.dynamicStrength(() => this.challengeBonus())
        });
    }

    challengeBonus() {
        let numChallenges = this.game.currentChallenge.number;
        if(numChallenges === 1) {
            return -1;
        }

        if(numChallenges === 3) {
            return 2;
        }

        return 0;
    }

    afterChallenge(event) {
        let challenge = event.challenge;
        if(challenge.attackingPlayer !== this.controller) {
            return;
        }

        let currentChallenge = this.game.currentChallenge.number;
        if(challenge.winner === this.controller && currentChallenge === 3) {
            this.game.addMessage('{0} gains 1 power from {1}', challenge.winner, this);
            this.game.addPower(challenge.winner, 1);
        }
    }
}

TheLordOfTheCrossing.code = '02060';

module.exports = TheLordOfTheCrossing;
