const DrawCard = require('../../../drawcard.js');

class SweetDonnelHill extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isDefending(this),
            match: (card) => this.game.currentChallenge.isAttacking(card) && card.getType() === 'character',
            targetController: 'any',
            effect: [
                ability.effects.removeKeyword('Ambush'),
                ability.effects.removeKeyword('Insight'),
                ability.effects.removeKeyword('Intimidate'),
                ability.effects.removeKeyword('Pillage'),
                ability.effects.removeKeyword('Renown'),
                ability.effects.removeKeyword('Stealth'),
                ability.effects.removeKeyword('Terminal'),
                ability.effects.removeKeyword('Limited')
            ]
        });
    }
}

SweetDonnelHill.code = '05031';

module.exports = SweetDonnelHill;
