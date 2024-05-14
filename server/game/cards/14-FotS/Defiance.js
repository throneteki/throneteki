import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import ParticipationTracker from '../../EventTrackers/ParticipationTracker.js';

class Defiance extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ParticipationTracker.forPhase(this.game);

        this.action({
            title: 'Stand character',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    !this.tracker.hasParticipated(card),
                gameAction: 'stand'
            },
            message: '{player} plays {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            },
            max: ability.limit.perPhase(1)
        });
    }
}

Defiance.code = '14044';

export default Defiance;
