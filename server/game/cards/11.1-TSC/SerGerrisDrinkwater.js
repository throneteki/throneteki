import DrawCard from '../../drawcard.js';

class SerGerrisDrinkwater extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            targets: {
                plotCard: {
                    activePromptTitle: 'Select a plot card',
                    cardCondition: (card) =>
                        card.controller === this.controller && card.location === 'plot deck',
                    cardType: 'plot'
                },
                usedPlotCard: {
                    type: 'select',
                    activePromptTitle: 'Select a used plot card',
                    cardCondition: (card) =>
                        card.controller === this.controller && card.location === 'revealed plots',
                    cardType: 'plot'
                }
            },
            handler: (context) => {
                this.controller.moveCard(context.targets.plotCard, 'revealed plots');
                this.controller.moveCard(context.targets.usedPlotCard, 'plot deck');
                this.game.addMessage(
                    '{0} uses {1} to switch {2} from their plot deck with {3} in their used pile',
                    this.controller,
                    this,
                    context.targets.plotCard,
                    context.targets.usedPlotCard
                );
            }
        });
    }
}

SerGerrisDrinkwater.code = '11016';

export default SerGerrisDrinkwater;
