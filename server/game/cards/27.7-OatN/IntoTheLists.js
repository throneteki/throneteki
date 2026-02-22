// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Created plot card where each player kneels a character, highest STR gains power
// - 2026-01-31: Rewrote using choosingPlayer: 'each' and simultaneous game actions

import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class IntoTheLists extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: {
                format: '{player} uses {source} to have each player kneel a character for the lists'
            },
            handler: (context) => {
                const cards = context.targets.selections
                    .map((selection) => selection.value)
                    .filter((card) => !!card);

                if (cards.length === 0) {
                    return;
                }

                // Log each player's knelt character
                for (const selection of context.targets.selections) {
                    if (selection.value) {
                        this.game.addMessage(
                            '{0} kneels {1} for {2}',
                            selection.choosingPlayer,
                            selection.value,
                            this
                        );
                    }
                }

                // Kneel all selected characters simultaneously, then award power to highest STR
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        cards.map((card) => GameActions.kneelCard({ card }))
                    ).then(() => ({
                        message: '{player} {gameAction}',
                        gameAction: GameActions.simultaneously(() => {
                            const highestStr = Math.max(...cards.map((card) => card.getStrength()));
                            const winners = cards.filter(
                                (card) => card.getStrength() === highestStr
                            );
                            return winners.map((winner) =>
                                GameActions.gainPower({
                                    card: winner,
                                    amount: winner.hasTrait('Knight') ? 2 : 1
                                })
                            );
                        })
                    })),
                    context
                );
            }
        });
    }
}

IntoTheLists.code = '27611';
IntoTheLists.version = '1.0.0';

export default IntoTheLists;
