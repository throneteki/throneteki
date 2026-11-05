import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ConsolidationOfPower extends DrawCard {
    // Consolidation of Power (01062)
    // Marshaling Action: Choose and kneel up to 4 total STR worth of characters controlled by the
    // same player. Then, choose one of those characters, and have it gain 1 power.
    setupCardAbilities() {
        this.action({
            title: 'Kneel 4 STR worth of characters',
            phase: 'marshal',
            target: {
                activePromptTitle: 'Select character(s)',
                maxStat: () => 4,
                cardStat: (card) => card.getStrength(),
                singleController: true,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} plays {source} to kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kneelCard({ card }))
            ).then({
                target: {
                    activePromptTitle: 'Select character to gain power',
                    cardCondition: (card, context) => context.parentContext.target.includes(card),
                    gameAction: 'gainPower'
                },
                message: 'Then {player} chooses {target} to gain 1 power',
                gameAction: GameActions.gainPower((context) => ({
                    card: context.target,
                    amount: 1
                }))
            })
        });
    }
}

ConsolidationOfPower.code = '01062';

export default ConsolidationOfPower;
