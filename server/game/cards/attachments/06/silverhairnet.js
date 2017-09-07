const DrawCard = require('../../../drawcard.js');

class SilverHairNet extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: 1,
                match: card => card.getType() === 'event'
            })
        });      
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('Lady')) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

SilverHairNet.code = '06044';

module.exports = SilverHairNet;
