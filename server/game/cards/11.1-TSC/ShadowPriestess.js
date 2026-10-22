import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowPriestess extends DrawCard {
    // Shadow Priestess (11008)
    // Shadow (3).
    // Reaction: After Shadow Priestess comes out of shadows, choose and kneel a character without
    // attachments.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

ShadowPriestess.code = '11008';

export default ShadowPriestess;
