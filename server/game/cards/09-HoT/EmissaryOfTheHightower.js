import DrawCard from '../../drawcard.js';

class EmissaryOfTheHightower extends DrawCard {
    // Emissary of the Hightower (09011)
    // Ambush (4).
    // Reaction: After Emissary of the Hightower enters play, choose an event in your discard pile.
    // Until the end of the phase, you may play that event as if it were in your hand. If you do,
    // remove it from the game instead of placing it into your discard pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.getType() === 'event' &&
                    card.location === 'discard pile'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to allow {2} to be played as if it were in their hand',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.canPlay((card) => card === context.target)
                }));

                this.lastingEffect((ability) => ({
                    until: {
                        onCardPlayed: (event) => event.card === context.target,
                        onPhaseEnded: () => true
                    },
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.setEventPlacementLocation('out of game')
                }));
            }
        });
    }
}

EmissaryOfTheHightower.code = '09011';

export default EmissaryOfTheHightower;
