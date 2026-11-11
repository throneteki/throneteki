import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernArmory extends DrawCard {
    // Northern Armory (11003)
    // Northern Armory cannot stand.
    // Action: Kneel Northern Armory to choose and stand a [stark] character.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeStood()
        });
        this.action({
            title: 'Stand a character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: { location: 'play area', type: 'character', faction: 'stark' },
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

NorthernArmory.code = '11003';

export default NorthernArmory;
