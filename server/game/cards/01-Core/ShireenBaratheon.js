import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShireenBaratheon extends DrawCard {
    // Shireen Baratheon (01051)
    // Interrupt: When Shireen Baratheon is killed, choose and kneel a character.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

ShireenBaratheon.code = '01051';

export default ShireenBaratheon;
