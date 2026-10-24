import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class UnbridledGenerosity extends DrawCard {
    // Unbridled Generosity (06118)
    // Action: Choose up to 3 cards. Move 1 gold from the treasury to each of those cards.
    setupCardAbilities() {
        this.action({
            title: 'Put gold on cards',
            target: {
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card) => card.location === 'play area',
                numCards: '3',
                multiSelect: true
            },
            message: '{player} plays {source} to move 1 gold from the treasury to {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.placeToken({ card, token: Tokens.gold }))
            )
        });
    }
}

UnbridledGenerosity.code = '06118';

export default UnbridledGenerosity;
