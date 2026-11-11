import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ConspiratorsBlade extends DrawCard {
    // Conspirator's Blade (26070)
    // Shadow (1).
    // While attached character is participating in a challenge, the effects of events you play
    // cannot be canceled.
    // Reaction: After Conspirator's Blade comes out of shadows, reduce the cost of the next card
    // you bring out of shadows this phase by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            targetLocation: 'any',
            match: (card, context) =>
                card.getType() === 'event' && card.controller === context.source.controller,
            effect: ability.effects.cannotBeCanceled()
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to reduce the cost of the next card they bring out of shadows this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextOutOfShadowsCardCost(2)
            }))
        });
    }
}

ConspiratorsBlade.code = '26070';

export default ConspiratorsBlade;
