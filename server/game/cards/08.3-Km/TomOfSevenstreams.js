import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TomOfSevenstreams extends DrawCard {
    // Tom of Sevenstreams (08057)
    // Reaction: After you play a Song event, choose and stand a non-loyal character you control.
    // (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasTrait('Song') &&
                    event.card.controller === context.source.controller
            },
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.source.controller &&
                    !card.isLoyal() &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

TomOfSevenstreams.code = '08057';

export default TomOfSevenstreams;
