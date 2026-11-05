import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BrandonsGift extends DrawCard {
    // Brandon's Gift (02026)
    // Reaction: After you marshal a Builder character, reduce the cost of the next [thenightswatch]
    // card you marshal this phase by 1. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.playingType === 'marshal' &&
                    event.card.hasTrait('Builder') &&
                    event.card.getType() === 'character'
            },
            limit: ability.limit.perPhase(3),
            message:
                '{player} uses {source} to reduce the cost of the next thenightswatch card they marshal this phase by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(1, (card) =>
                    card.isFaction('thenightswatch')
                )
            }))
        });
    }
}

BrandonsGift.code = '02026';

export default BrandonsGift;
