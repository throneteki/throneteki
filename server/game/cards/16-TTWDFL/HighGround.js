import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HighGround extends DrawCard {
    // High Ground (16019)
    // Challenges Action: Kneel High Ground to choose and stand an Army character.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    location: 'play area',
                    trait: 'Army',
                    type: 'character',
                    kneeled: true
                },
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({
                card: context.target
            }))
        });
    }
}

HighGround.code = '16019';

export default HighGround;
