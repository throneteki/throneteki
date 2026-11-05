import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';

class FavorOfTheOldGods extends DrawCard {
    // Favor of the Old Gods (08062)
    // Attached character gains the Old Gods trait.
    // Action: If each character, location, and attachment you control has the [stark] affiliation,
    // kneel Favor of the Old Gods to stand attached character.
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
