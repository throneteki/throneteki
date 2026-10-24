import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Pyromancers extends DrawCard {
    // Pyromancers (04018)
    // Dominance Action: Kneel Pyromancers and discard 1 power from your faction card to choose a
    // non-limited location, and discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a location',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFactionPower(1)],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            message:
                '{player} kneels {source} and discards a power from their faction to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

Pyromancers.code = '04018';

export default Pyromancers;
