import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLandingMob extends DrawCard {
    // King's Landing Mob (24025)
    // Assault.
    // Reaction: After a location is knelt by assault, kill King's Landing Mob to discard that
    // location from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardKneeled: (event) => event.reason === 'assault'
            },
            cost: ability.costs.killSelf(),
            message: {
                format: '{player} kills {costs.kill} to discard {assaulted} from play',
                args: { assaulted: (context) => context.event.card }
            },
            gameAction: GameActions.discardCard((context) => ({ card: context.event.card }))
        });
    }
}

KingsLandingMob.code = '24025';

export default KingsLandingMob;
