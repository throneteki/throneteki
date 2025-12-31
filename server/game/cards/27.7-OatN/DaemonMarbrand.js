import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaemonMarbrand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardReturnedToHand: (event) => this.returnConditions(event)
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: "{player} uses {source} to discard a card at random from {opponent}'s hand",
                args: { opponent: (context) => context.event.card.controller }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.card.controller,
                amount: 1
            }))
        });
    }

    returnConditions(event) {
        // Can only react if the card is returned/placed from a location which his controller can see (play area, discard pile, dead pile)
        return (
            event.card !== this &&
            event.card.controller !== this.controller &&
            event.card.getType() === 'character' &&
            ['play area', 'discard pile', 'dead pile'].includes(event.card.location)
        );
    }
}

DaemonMarbrand.code = '27525';
DaemonMarbrand.version = '1.0.0';

export default DaemonMarbrand;
