const DrawCard = require('../../drawcard.js');

class TheRedViper extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasAttackingBastard(event.challenge)
            },
            handler: context => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', context.player, this);
            }
        });
    }

    hasAttackingBastard(challenge) {
        return this.controller.anyCardsInPlay(card => challenge.isAttacking(card) && card.hasTrait('Bastard'));
    }
}

TheRedViper.code = '10003';

module.exports = TheRedViper;
