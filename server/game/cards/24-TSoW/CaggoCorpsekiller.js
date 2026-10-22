import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CaggoCorpsekiller extends DrawCard {
    // Caggo Corpsekiller (24011)
    // Interrupt: When another character is returned to a player's hand or placed in shadows, return
    // Caggo Corpsekiller to your hand to place that character in its owner's dead pile instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReturnedToHand: (event, context) => canReplace(event, context),
                onCardPutIntoShadows: (event, context) => canReplace(event, context)
            },
            cost: ability.costs.returnSelfToHand(),
            message: {
                format: "{player} returns {costs.returnToHand} to place {card} in its owner's dead pile instead of their {targetLocation}",
                args: {
                    card: (context) => context.event.card,
                    targetLocation: (context) =>
                        context.event.location === 'shadows'
                            ? 'shadow area'
                            : context.event.location
                }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({
                    card: context.event.card,
                    location: 'dead pile'
                })
            }))
        });
    }
}

// Caggo can only interrupt if the card is returned or placed from a location his controller can see.
function canReplace(event, context) {
    return (
        event.card !== context.source &&
        event.card.getType() === 'character' &&
        ['play area', 'discard pile', 'dead pile'].includes(event.card.location)
    );
}

CaggoCorpsekiller.code = '24011';

export default CaggoCorpsekiller;
