// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card with action to place card under agenda to draw
// - 2026-01-31: Refactored to use cost for placement and gameAction for drawing

import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class SearchingTheArchives extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place a card under your agenda',
            cost: ability.costs
                .placeCardUnderneath((context) => context.player.agenda)
                .select((card) => card.location === 'hand'),
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} to place a card from their hand under their agenda and draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 1
            }))
        });
    }
}

SearchingTheArchives.code = '27613';
SearchingTheArchives.version = '1.0.0';

export default SearchingTheArchives;
