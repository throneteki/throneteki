const RecentAbilityCount = 3;

function summariseCard(card) {
    return card && card.code ? { code: card.code, name: card.name } : undefined;
}

/**
 * Records every use of a manual control (chat commands, drag and drop, stat buttons, clicking to
 * kneel) in the acting player's game stats, along with the abilities that were resolving or had
 * just resolved. Manual corrections are usually a sign that the engine got a card wrong, so this
 * shows which cards need fixing and testing next.
 */
class ManualActions {
    constructor(game) {
        this.game = game;
        this.recentAbilities = [];

        game.on('onCardAbilityInitiated', (event) => {
            const source = summariseCard(event.source);
            if (source) {
                this.recentAbilities = [source, ...this.recentAbilities].slice(
                    0,
                    RecentAbilityCount
                );
            }
        });
    }

    record(player, action, { cards = [], args } = {}) {
        const stats = this.game.stats.forPlayer(player);
        if (!stats) {
            return null;
        }

        const resolving = summariseCard(this.game.currentAbilityContext?.source);
        const prompt = player.currentPrompt?.()?.menuTitle;
        const entry = {
            action,
            round: this.game.round,
            phase: this.game.currentPhase,
            cards: cards.map(summariseCard).filter(Boolean),
            ...(args !== undefined && { args }),
            ...(resolving && { resolving }),
            ...(prompt && { prompt }),
            recentAbilities: [...this.recentAbilities]
        };

        stats.manualActions.push(entry);
        return entry;
    }

    addCards(entry, cards) {
        if (!entry) {
            return;
        }

        for (const card of cards.map(summariseCard).filter(Boolean)) {
            if (!entry.cards.some((existing) => existing.code === card.code)) {
                entry.cards.push(card);
            }
        }
    }
}

export default ManualActions;
