import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HiddenInShadow extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current' });
        this.action({
            title: 'Return attached to shadows',
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to return {parent} to shadows',
                args: { parent: (context) => this.parent || context.cardStateWhenInitiated.parent }
            },
            gameAction: GameActions.putIntoShadows((context) => ({
                card: this.parent || context.cardStateWhenInitiated.parent
            }))
        });
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this && event.originalLocation === 'shadows'
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

HiddenInShadow.code = '26108';

export default HiddenInShadow;
