// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card that moves gold from characters to player's gold pool
// - 2026-01-31: Fixed to only move gold from your own characters

import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class RaisingTaxes extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to move all gold from their characters to their gold pool',
            gameAction: GameActions.simultaneously((context) =>
                context.player
                    .filterCardsInPlay((card) => card.getType() === 'character' && card.gold > 0)
                    .map((card) =>
                        GameActions.transferGold({
                            source: card,
                            target: context.player,
                            amount: card.gold
                        })
                    )
            )
        });
    }
}

RaisingTaxes.code = '27616';
RaisingTaxes.version = '1.0.0';

export default RaisingTaxes;
