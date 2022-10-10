const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MaesterColemon extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control and move attachment',
            phase: 'dominance',
            cost: ability.costs.kneel(card => card.getType() === 'character' && card.hasTrait('Maester') && card.isUnique()),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: {
                    location: 'play area',
                    trait: ['Condition', 'Item'],
                    type: 'attachment',
                    condition: (card, context) => !context.costs.kneel || card.getPrintedCost() < context.costs.kneel.getPrintedCost()
                }
            },
            message: { format: '{player} kneels {kneel} to move and take control of {target}', args: { kneel: context => context.costs.kneel } },
            handler: context => {
                const attachment = context.target;

                this.game.promptForSelect(context.player, {
                    cardCondition: newParent => (
                        newParent.getType() === 'character' &&
                        newParent !== attachment.parent &&
                        attachment.controller.canAttach(attachment, newParent) &&
                        newParent.location === 'play area'
                    ),
                    onSelect: (player, newParent) => {
                        this.game.addMessage('{0} moves {1} from {2} to {3}', player, attachment, attachment.parent, newParent);
                        player.attach(player, attachment, newParent);
                        return true;
                    }
                });

                this.game.resolveGameAction(
                    GameActions.takeControl(context => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

MaesterColemon.code = '23025';

module.exports = MaesterColemon;
