import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StannissWrath extends DrawCard {
    // Stannis's Wrath (08028)
    // Action: Choose and kneel a character without a [power] icon.
    setupCardAbilities() {
        this.action({
            title: 'Kneel character',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasIcon('power'),
                gameAction: 'kneel'
            },
            message: '{player} plays {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

StannissWrath.code = '08028';

export default StannissWrath;
