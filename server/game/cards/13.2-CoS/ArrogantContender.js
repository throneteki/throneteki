const DrawCard = require('../../drawcard');

class ArrogantContender extends DrawCard {
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

module.exports = ArrogantContender;
