import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SouthronEscort extends DrawCard {
    // Southron Escort (13015)
    // Shadow (4).
    // Action: Discard another card from shadows to put Southron Escort into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: (context) =>
                context.source.controller.canPutIntoPlay(context.source, 'outOfShadows'),
            location: 'shadows',
            cost: ability.costs.discardFromShadows((card, context) => card !== context.source),
            message: {
                format: '{player} uses {source} and discards {discardedCard} from shadows to put {source} into play from shadows',
                args: { discardedCard: (context) => context.costs.discardFromShadows }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

SouthronEscort.code = '13015';

export default SouthronEscort;
