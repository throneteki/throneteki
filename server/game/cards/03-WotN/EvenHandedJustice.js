import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EvenHandedJustice extends DrawCard {
    // Even Handed Justice (03026)
    // Action: Choose a standing character controlled by each player. Kneel each of those
    // characters.
    setupCardAbilities() {
        this.action({
            title: 'Kneel a character for each player',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                mode: 'eachPlayer',
                gameAction: 'kneel'
            },
            message: '{player} plays {source} to kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kneelCard({ card }))
            )
        });
    }
}

EvenHandedJustice.code = '03026';

export default EvenHandedJustice;
