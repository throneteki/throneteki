import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WeStandTogether extends DrawCard {
    // We Stand Together (20050)
    // Reaction: After you win a challenge, choose and stand an attacking House Frey character.
    // (Stand each attacking House Frey character instead if it was the third challenge you
    // initiated this phase.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.hasTrait('House Frey'),
                gameAction: 'stand'
            },
            message: {
                format: '{player} plays {source} to stand {characters}',
                args: { characters: (context) => standing(context) }
            },
            gameAction: GameActions.simultaneously((context) =>
                standing(context).map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

function standing(context) {
    if (context.event.challenge.number !== 3) {
        return [context.target];
    }
    return context.event.challenge.attackers.filter(
        (card) => card.hasTrait('House Frey') && card.getType() === 'character'
    );
}

WeStandTogether.code = '20050';

export default WeStandTogether;
