const DrawCard = require('../../../drawcard.js');

class Tokar extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.parent.attachments.size())
        });

        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent),
            match: card => card.getType() === 'character' && card.attachments.size() === 0,
            targetController: 'any',
            effect: ability.effects.cannotGainPower()
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('targaryen')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Tokar.code = '09038';

module.exports = Tokar;
