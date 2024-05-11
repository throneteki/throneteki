const DrawCard = require('../../drawcard.js');

class MarshsConspirator extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                cardCondition: card => card.getType() === 'character' && card.location === 'play area'
            },
            message: '{player} uses {source} to treat the text box of {target} as blank until the end of the phase',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }
}

MarshsConspirator.code = '25049';

module.exports = MarshsConspirator;
