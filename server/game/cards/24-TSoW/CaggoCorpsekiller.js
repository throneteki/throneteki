import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CaggoCorpsekiller extends DrawCard {
    // Caggo Corpsekiller (24011)
    // Interrupt: When another character is returned to a player's hand or placed in shadows, return
    // Caggo Corpsekiller to your hand to place that character in its owner's dead pile instead.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardReturnedToHand: (event) => this.returnConditions(event),
                onCardPutIntoShadows: (event) => this.returnConditions(event)
            },
            cost: ability.costs.returnSelfToHand(),
            message: {
                format: "{player} returns {costs.returnToHand} to place {card} in it's owners dead pile instead of their {targetLocation}",
                args: {
                    card: (context) => context.event.card,
                    targetLocation: (context) =>
                        context.event.location === 'shadows'
                            ? 'shadow area'
                            : context.event.location
                }
            },
            handler: (context) => {
                context.event.replaceHandler(() => {
                    this.game.resolveGameAction(
                        GameActions.placeCard((context) => ({
                            card: context.event.card,
                            location: 'dead pile'
                        })),
                        context
                    );
                });
            }
        });
    }

    returnConditions(event) {
        // Caggo can only interrupt if the card is returned/placed from a location which his controller can see (play area, discard pile, dead pile)
        return (
            event.card !== this &&
            event.card.getType() === 'character' &&
            ['play area', 'discard pile', 'dead pile'].includes(event.card.location)
        );
    }
}

CaggoCorpsekiller.code = '24011';

export default CaggoCorpsekiller;
