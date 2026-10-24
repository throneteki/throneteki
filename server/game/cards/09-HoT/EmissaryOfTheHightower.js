import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EmissaryOfTheHightower extends DrawCard {
    // Emissary of the Hightower (09011)
    // Ambush (4).
    // Reaction: After Emissary of the Hightower enters play, choose an event in your discard pile.
    // Until the end of the phase, you may play that event as if it were in your hand. If you do,
    // remove it from the game instead of placing it into your discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.getType() === 'event' &&
                    card.location === 'discard pile'
            },
            message:
                '{player} uses {source} to allow {target} to be played as if it were in their hand',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.canPlay((card) => card === context.target)
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardPlayed: (event) => event.card === context.target,
                        onPhaseEnded: () => true
                    },
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.setEventPlacementLocation('out of game')
                }))
            ])
        });
    }
}

EmissaryOfTheHightower.code = '09011';

export default EmissaryOfTheHightower;
