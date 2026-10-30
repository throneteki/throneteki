import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JadeSeaDromond extends DrawCard {
    // Jade Sea Dromond (10042)
    // Limited.
    // Dominance Action: Kneel and sacrifice Jade Sea Dromond to choose a non-limited location with
    // printed cost 3 or lower and discard it from play.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Discard location',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3,
                gameAction: 'discard'
            },
            message: '{player} kneels and sacrifices {source} to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

JadeSeaDromond.code = '10042';

export default JadeSeaDromond;
