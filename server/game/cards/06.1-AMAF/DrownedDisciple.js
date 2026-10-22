import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DrownedDisciple extends DrawCard {
    // Drowned Disciple (06011)
    // Reaction: After a character enters play from your dead pile, choose a Drowned God character
    // and have it gain 1 power. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === context.source.controller &&
                    event.originalLocation === 'dead pile'
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Drowned God') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

DrownedDisciple.code = '06011';

export default DrownedDisciple;
