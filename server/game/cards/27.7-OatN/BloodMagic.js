// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-26: Implement Blood Magic

import PlotCard from '../../plotcard.js';

class BloodMagic extends PlotCard {
    setupCardAbilities(ability) {
        const validTargetExists = (card) =>
            card.controller.deadPile.some(
                (deadCard) => deadCard.getPrintedCost() <= card.getPrintedCost()
            );

        this.whenRevealed({
            cost: ability.costs.kill({
                type: 'character',
                unique: true,
                condition: (card) => card.canBeKilled() && validTargetExists(card)
            }),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: (card, context) =>
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    card.isUnique() &&
                    (!context.costs.kill ||
                        (card !== context.costs.kill &&
                            card.getPrintedCost() <= context.costs.kill.getPrintedCost())) &&
                    card.controller === context.player &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2} and put {3} into play from their dead pile',
                    context.player,
                    this,
                    context.costs.kill,
                    context.target
                );
            }
        });
    }
}

BloodMagic.code = '27615';
BloodMagic.version = '1.0.0';

export default BloodMagic;
