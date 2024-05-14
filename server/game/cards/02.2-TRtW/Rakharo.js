const DrawCard = require('../../drawcard.js');

class Rakharo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasAnotherBloodrider(),
            match: this,
            effect: ability.effects.addKeyword('intimidate')
        });

        this.reaction({
            when: {
                onCharacterKilled: () =>
                    this.game.isDuringChallenge({ attackingPlayer: this.controller }) &&
                    this.game.claim.isApplying &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }

    hasAnotherBloodrider() {
        return this.controller.anyCardsInPlay(
            (card) => card !== this && card.getType() === 'character' && card.hasTrait('Bloodrider')
        );
    }
}

Rakharo.code = '02033';

module.exports = Rakharo;
