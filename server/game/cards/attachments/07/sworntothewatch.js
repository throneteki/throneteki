const DrawCard = require('../../../drawcard.js');

class SwornToTheWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addFaction('thenightswatch')
        });
        this.whileAttached({
            match: card => card.hasIcon('military'),
            effect: ability.effects.addTrait('Ranger')
        });
        this.whileAttached({
            match: card => card.hasIcon('intrigue'),
            effect: ability.effects.addTrait('Steward')
        });
        this.whileAttached({
            match: card => card.hasIcon('power'),
            effect: ability.effects.addTrait('Builder')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SwornToTheWatch.code = '07022';

module.exports = SwornToTheWatch;
