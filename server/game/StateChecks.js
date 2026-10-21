class StateChecks {
    constructor(game) {
        this.game = game;
        this.resolving = new Set();
    }

    enforce() {
        const abilities = this.game
            .filterCardsInPlay((card) => card.abilities.stateChecks.length > 0)
            .flatMap((card) => card.abilities.stateChecks)
            .filter((ability) => !this.resolving.has(ability));

        for (const ability of abilities) {
            if (!ability.canResolve(ability.createContext())) {
                continue;
            }

            this.resolving.add(ability);
            this.game.queueSimpleStep(() => {
                const context = ability.createContext();
                if (ability.canResolve(context)) {
                    this.game.resolveAbility(ability, context);
                }
            });
            this.game.queueSimpleStep(() => this.resolving.delete(ability));
        }
    }
}

export default StateChecks;
