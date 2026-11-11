import ChooseResolutionOrder from './gamesteps/ChooseResolutionOrder.js';

class StateChecks {
    constructor(game) {
        this.game = game;
        this.resolving = new Set();
    }

    enforce() {
        const abilities = this.game
            .filterCardsInPlay((card) => card.abilities.stateChecks.length > 0)
            .flatMap((card) => card.abilities.stateChecks)
            .filter(
                (ability) =>
                    !this.resolving.has(ability) && ability.canResolve(ability.createContext())
            );

        if (abilities.length === 0) {
            return;
        }

        for (const ability of abilities) {
            this.resolving.add(ability);
        }

        this.game.queueStep(
            new ChooseResolutionOrder(
                this.game,
                abilities.map((ability) => ({
                    player: ability.card.controller,
                    source: ability.card,
                    canResolve: () => ability.canResolve(ability.createContext()),
                    resolve: () => this.game.resolveAbility(ability, ability.createContext())
                }))
            )
        );
        this.game.queueSimpleStep(() => {
            for (const ability of abilities) {
                this.resolving.delete(ability);
            }
        });
    }
}

export default StateChecks;
