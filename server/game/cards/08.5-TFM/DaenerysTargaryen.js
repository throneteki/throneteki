const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotDecreaseStrength(context => context.resolutionStage === 'effect')
        });
        this.reaction({
            when: {
                onCardPlayed: event => event.card.controller === this.controller && event.card.isFaction('targaryen')
            },
            limit: ability.limit.perRound(3),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            effect: ability.effects.killByStrength(-1)
        });
    }
}

DaenerysTargaryen.code = '08093';

module.exports = DaenerysTargaryen;
