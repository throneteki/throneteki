import ChooseResolutionOrder from './gamesteps/ChooseResolutionOrder.js';

class StateChecks {
    constructor(game) {
        this.game = game;
        this.resolving = new Set();
        this.burning = new Set();
    }

    // A character is removed once each time it reaches 0 STR while a burn effect is on it. It is
    // not removed again until it has been above 0 STR or lost the burn, so a save that remedies
    // the condition stops any later removal tied to it (FAQ 3.1).
    checkBurn(card) {
        if (!this.isAtBurnCondition(card)) {
            this.burning.delete(card);
            return;
        }

        if (this.burning.has(card)) {
            return;
        }

        const action = card.createBurnAction();
        if (!action.allow()) {
            return;
        }

        this.burning.add(card);
        if (!card.isBurning) {
            this.game.addMessage('{0} is 0 STR and placed in shadows', card);
        }
        this.game.resolveGameAction(action);
    }

    isAtBurnCondition(card) {
        return (
            card.location === 'play area' &&
            (card.isBurning || card.isShadowBurning) &&
            card.getStrength() === 0
        );
    }

    enforce() {
        for (const card of this.burning) {
            if (!this.isAtBurnCondition(card)) {
                this.burning.delete(card);
            }
        }

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
