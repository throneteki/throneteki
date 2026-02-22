// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card that kneels all attachments and locations when revealed
// - 2026-01-25: Refactored to use message/gameAction syntax

import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class SnowStorm extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to kneel each attachment and location',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) =>
                            (card.getType() === 'attachment' || card.getType() === 'location') &&
                            !card.kneeled
                    )
                    .map((card) => GameActions.kneelCard({ card }))
            )
        });
    }
}

SnowStorm.code = '27617';
SnowStorm.version = '1.0.0';

export default SnowStorm;
