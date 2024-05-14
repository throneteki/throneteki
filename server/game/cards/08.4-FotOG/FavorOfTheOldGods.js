import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';

class FavorOfTheOldGods extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Old Gods')
        });

        this.action({
            title: 'Stand attached character',
            condition: (context) => Conditions.allCardsAreStark({ player: context.player }),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({
                card: context.source.parent
            }))
        });
    }
}

FavorOfTheOldGods.code = '08062';

export default FavorOfTheOldGods;
