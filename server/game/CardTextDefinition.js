class CardTextDefinition {
    constructor() {
        this.actionDefinitions = [];
        this.actions = [];
    }

    action(properties) {
        this.actionDefinitions.push(properties);
    }

    apply(card) {
        const actions = this.actionDefinitions.map((definition) => card.action(definition));

        for (const action of actions) {
            if (action.isEventListeningLocation(card.location)) {
                action.registerEvents();
            }
        }

        this.actions = this.actions.concat(actions);
    }

    unapply(card) {
        for (const action of this.actions) {
            if (action.isEventListeningLocation(card.location)) {
                action.unregisterEvents();
            }

            card.abilities.actions = card.abilities.actions.filter((a) => a !== action);
        }
    }
}

export default CardTextDefinition;
