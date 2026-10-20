import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGerrisDrinkwater extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            targets: {
                plotCard: {
                    activePromptTitle: 'Select a plot card',
                    cardCondition: (card, context) =>
                        card.controller === context.player && card.location === 'plot deck',
                    cardType: 'plot'
                },
                usedPlotCard: {
                    type: 'select',
                    activePromptTitle: 'Select a used plot card',
                    cardCondition: (card, context) =>
                        card.controller === context.player && card.location === 'revealed plots',
                    cardType: 'plot'
                }
            },
            gameAction: GameActions.switch((context) => ({
                cards: [context.targets.plotCard, context.targets.usedPlotCard]
            })),
            message: {
                format: '{player} uses {source} to switch {plotCard} from their plot deck with {usedPlotCard} in their used pile',
                args: {
                    plotCard: (context) => context.targets.plotCard,
                    usedPlotCard: (context) => context.targets.usedPlotCard
                }
            }
        });
    }
}

SerGerrisDrinkwater.code = '11016';

export default SerGerrisDrinkwater;
