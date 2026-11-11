import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VerteranBuilder extends DrawCard {
    // Veteran Builder (01134)
    // No attachments except Weapon.
    // Action: Sacrifice Veteran Builder to choose and stand a location.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a location',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location'
            },
            message: '{player} sacrifices {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

VerteranBuilder.code = '01134';

export default VerteranBuilder;
