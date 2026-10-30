import DrawCard from '../../drawcard.js';
import Message from '../../Message.js';
import GameActions from '../../GameActions/index.js';

class ThePackSurvives extends DrawCard {
    // The Pack Survives (03023)
    // Interrupt: When the effects of an opponent's event would initiate, sacrifice a Direwolf card
    // or kneel 2 [stark] characters to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.source.getType() === 'event' && event.player !== context.player
            },
            cost: ability.costs.choose({
                'Sacrifice Direwolf': ability.costs.sacrifice((card) => card.hasTrait('Direwolf')),
                'Kneel 2 Starks': ability.costs.kneelMultiple(
                    2,
                    (card) => card.isFaction('stark') && card.getType() === 'character'
                )
            }),
            message: {
                format: '{player} plays {source} and {cost} to cancel {eventSource}',
                args: {
                    cost: (context) =>
                        context.costs.sacrifice
                            ? Message.fragment('sacrifices {card}', {
                                  card: context.costs.sacrifice
                              })
                            : Message.fragment('kneels {cards}', { cards: context.costs.kneel }),
                    eventSource: (context) => context.event.source
                }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

ThePackSurvives.code = '03023';

export default ThePackSurvives;
