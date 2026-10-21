import DrawCard from '../../drawcard.js';

class SouthronEscort extends DrawCard {
    // Southron Escort (13015)
    // Shadow (4).
    // Action: Discard another card from shadows to put Southron Escort into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: () => this.controller.canPutIntoPlay(this, 'outOfShadows'),
            location: 'shadows',
            cost: ability.costs.discardFromShadows((card) => card !== this),
            message: {
                format: '{player} uses {source} and discards {discardedCard} from shadows to put {source} into play from shadows',
                args: { discardedCard: (context) => context.costs.discardFromShadows }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

SouthronEscort.code = '13015';

export default SouthronEscort;
