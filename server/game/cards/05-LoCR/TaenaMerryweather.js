import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TaenaMerryweather extends DrawCard {
    // Taena Merryweather (05010)
    // Reaction: After you play an event, choose and discard 1 card from your hand to draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.getType() === 'event' &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.discardFromHand(),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TaenaMerryweather.code = '05010';

export default TaenaMerryweather;
