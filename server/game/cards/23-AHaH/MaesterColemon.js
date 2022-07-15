const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class MaesterColemon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.kneeled,
            match: card => card.name === 'Sweetrobin',
            effect: ability.effects.blankExcludingTraits
        });

        this.action({
            title: 'Take control and move attachment',
            phase: 'dominance',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.payXGold(() => 0, () => 99)
            ],
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) => (
                    card.isMatch({
                        location: 'play area',
                        trait: 'Condition',
                        type: 'attachment',
                        printedCostOrLower: context.xValue
                    }) ||
                    card.name === 'Sweetsleep'
                )
            },
            message: { format: '{player} kneels {source} and pays {goldCost} gold to move and take control of {target}', args: { goldCost: context => context.goldCost } },
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
