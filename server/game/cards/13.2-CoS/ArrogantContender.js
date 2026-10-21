import DrawCard from '../../drawcard.js';

class ArrogantContender extends DrawCard {
    // Arrogant Contender (13023)
    // While Arrogant Contender is participating in a challenge, it gets +1 STR for each
    // participating character an opponent controls.
    // Reaction: After you win a challenge in which Arrogant Contender is attacking alone, it gains
    // 1 power for each defending character (to a maximum of 3 power).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge() && this.isParticipating(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.numOfOpponentParticipants())
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, attackingAlone: this }) &&
                    this.canGainPower()
            },
            message: {
                format: '{player} uses {source} to have it gain {gainedPower}',
                args: { gainedPower: () => this.gainedPowerAmount() }
            },
            handler: () => {
                this.modifyPower(this.gainedPowerAmount());
            }
        });
    }

    gainedPowerAmount() {
        return Math.min(this.numOfOpponentParticipants(), 3);
    }

    numOfOpponentParticipants() {
        let participants = this.game.currentChallenge.getParticipants();
        let opponentParticipants = participants.filter(
            (card) => card.controller !== this.controller
        );
        return opponentParticipants.length;
    }
}

ArrogantContender.code = '13023';

export default ArrogantContender;
