import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (01049)
    // Challenges Action: Pay 1 gold to choose a [baratheon] character. Until the end of the phase,
    // that character gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give an intrigue icon to a character',
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('baratheon') &&
                    card.getType() === 'character'
            },
            message: '{player} uses {source} to give {target} an intrigue icon',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addIcon('intrigue')
            }))
        });
    }
}

SelyseBaratheon.code = '01049';

export default SelyseBaratheon;
