import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterCressen extends DrawCard {
    // Maester Cressen (01046)
    // Marshaling Action: Kneel Maester Cressen to choose a Condition attachment, and discard it
    // from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.hasTrait('condition')
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

MaesterCressen.code = '01046';

export default MaesterCressen;
