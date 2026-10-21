import AgendaCard from '../../agendacard.js';

class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    // The Lord of the Crossing (02060)
    // During the first challenge you initiate each phase, each of your participating characters
    // gets -1 STR.
    // During the third challenge you initiate each phase, each of your participating characters
    // gets +2 STR. If you win this challenge, gain 1 power for your faction.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttackingDuringChallengeNumber(1),
            match: (card) => card.isAttacking(),
            effect: ability.effects.modifyStrength(-1)
        });
        this.persistentEffect({
            condition: () => this.isAttackingDuringChallengeNumber(3),
            match: (card) => card.isAttacking(),
            effect: ability.effects.modifyStrength(2)
        });
    }

    isAttackingDuringChallengeNumber(challengeNumber) {
        return this.game.isDuringChallenge({
            attackingPlayer: this.controller,
            number: challengeNumber
        });
    }

    afterChallenge(event) {
        let challenge = event.challenge;
        if (challenge.attackingPlayer !== this.controller) {
            return;
        }

        let currentChallenge = this.game.currentChallenge.number;
        if (
            challenge.winner === this.controller &&
            currentChallenge === 3 &&
            this.controller.canGainFactionPower()
        ) {
            this.game.addMessage('{0} gains 1 power from {1}', challenge.winner, this);
            this.game.addPower(challenge.winner, 1);
        }
    }
}

TheLordOfTheCrossing.code = '02060';

export default TheLordOfTheCrossing;
