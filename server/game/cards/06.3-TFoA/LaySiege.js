import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LaySiege extends DrawCard {
    // Lay Siege (06059)
    // Action: Choose and kneel a location. Then, if that location is Contested, discard it from
    // play.
    setupCardAbilities() {
        this.action({
            title: 'Kneel or discard location',
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location'
            },
            message: '{player} plays {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target })).then({
                condition: (context) => context.parentContext.target.hasTrait('Contested'),
                message: 'Then {player} discards {target} from play',
                gameAction: GameActions.discardCard((context) => ({
                    card: context.parentContext.target
                }))
            })
        });
    }
}

LaySiege.code = '06059';

export default LaySiege;
