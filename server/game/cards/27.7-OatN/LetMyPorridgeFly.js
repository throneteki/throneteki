// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card with forced reaction to reveal hands and discard lowest cost cards
// - 2026-01-31: Refactored to use .then() pattern and GameActions for discarding

import { flatMap } from '../../../Array.js';
import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class LetMyPorridgeFly extends PlotCard {
    setupCardAbilities() {
        const getAllHandCards = (game) => {
            return flatMap(game.getPlayersInFirstPlayerOrder(), (player) => [...player.hand]);
        };

        const getLowestCostCards = (cards) => {
            if (cards.length === 0) {
                return [];
            }
            const lowestCost = Math.min(...cards.map((card) => card.getPrintedCost()));
            return cards.filter((card) => card.getPrintedCost() === lowestCost);
        };

        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            message: '{player} uses {source} to have each player reveal their hand',
            gameAction: GameActions.revealCards((context) => ({
                cards: getAllHandCards(context.game),
                revealWithMessage: false
            })).then((context) => ({
                message: '{player} {gameAction}',
                gameAction: GameActions.simultaneously(() =>
                    getLowestCostCards(getAllHandCards(context.game)).map((card) =>
                        GameActions.discardCard({ card, allowSave: false })
                    )
                )
            }))
        });
    }
}

LetMyPorridgeFly.code = '27610';
LetMyPorridgeFly.version = '1.0.0';

export default LetMyPorridgeFly;
