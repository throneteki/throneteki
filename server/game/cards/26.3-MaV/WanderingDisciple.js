import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WanderingDisciple extends DrawCard {
    // Wandering Disciple (26043)
    // Shadow (3).
    // Reaction: After Wandering Disciple comes out of shadows, put a non-unique Drowned God
    // character into play from your dead pile. At the end of the phase, if that card is still in
    // play, discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Drowned God') &&
                    !card.isUnique() &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play from their dead pile',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target })).then({
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'atEndOfPhase',
                    match: context.parentContext.target,
                    condition: () =>
                        ['play area', 'duplicate'].includes(context.parentContext.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(true)
                }))
            })
        });
    }
}

WanderingDisciple.code = '26043';

export default WanderingDisciple;
