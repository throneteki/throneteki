import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import ParticipationTracker from '../../EventTrackers/ParticipationTracker.js';

class Defiance extends DrawCard {
    // Defiance (14044)
    // Challenges Action: Choose and stand a character that has not participated in a challenge this
    // phase. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.tracker = ParticipationTracker.forPhase(this.game);

        this.action({
            title: 'Stand character',
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    !context.source.tracker.hasParticipated(card),
                gameAction: 'stand'
            },
            message: '{player} plays {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target })),
            max: ability.limit.perPhase(1)
        });
    }
}

Defiance.code = '14044';

export default Defiance;
