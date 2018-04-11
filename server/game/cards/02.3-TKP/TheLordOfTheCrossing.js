const AgendaCard = require('../../agendacard.js');

class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttackingDuringChallengeNumber(1),
            match: card => this.game.currentChallenge.isAttacking(card),
            effect: ability.effects.modifyStrength(-1)
        });
        this.persistentEffect({
            condition: () => this.isAttackingDuringChallengeNumber(3),
            match: card => this.game.currentChallenge.isAttacking(card),
            effect: ability.effects.modifyStrength(2)
        });
    }

    isAttackingDuringChallengeNumber(challengeNumber) {
        return this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller && this.game.currentChallenge.number === challengeNumber;
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
