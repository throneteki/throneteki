import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Qarth extends DrawCard {
    // Qarth (10036)
    // Action: Kneel Qarth and pay 1 gold to choose an attachment attached to a card you control and
    // discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard attachment',
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.controller === context.source.controller,
                gameAction: 'discard'
            },
            message: '{player} kneels {source} and pays 1 gold to discard {target} from play',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

Qarth.code = '10036';

export default Qarth;
