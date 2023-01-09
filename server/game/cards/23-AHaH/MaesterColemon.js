const DrawCard = require('../../drawcard');

class MaesterColemon extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move attachment',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: { type: 'attachment', location: 'play area', trait: ['Condition', 'Item'], condition: card => this.game.anyCardsInPlay(c => c.getType() === 'character' && c !== card.parent && card.controller.canAttach(card, c))/* TODO: Remove this last condition once select gameAction implemented */ }
            },
            message: {
                format: '{player} kneels {costs.kneel} to move {target} from {parent} to another elibile character',
                args: { parent: context => context.target.parent }
            },
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
                        player.attach(player, attachment, newParent);
                        return true;
                    }
                });
            }
        });
    }
}

MaesterColemon.code = '23025';

module.exports = MaesterColemon;
