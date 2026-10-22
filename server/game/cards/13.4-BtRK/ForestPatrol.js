import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ForestPatrol extends DrawCard {
    // Forest Patrol (13065)
    // Shadow (4).
    // No attachments except Weapon.
    // Action: Kneel a [thenightswatch] location to put Forest Patrol into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            cost: ability.costs.kneel(
                (card) => card.isFaction('thenightswatch') && card.getType() === 'location'
            ),
            condition: (context) => context.player.canPutIntoPlay(context.source, 'outOfShadows'),
            message: {
                format: '{player} uses {source} and kneels {location} to put {source} into play from shadows',
                args: { location: (context) => context.costs.kneel }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

ForestPatrol.code = '13065';

export default ForestPatrol;
