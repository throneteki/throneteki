const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');

class InterruptWindow extends BaseStep {
    constructor(game, event, postHandlerFunc = () => true) {
        super(game);

        this.event = event;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.openAbilityWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.automaticSaveWithDupes()),
            new SimpleStep(game, () => this.openAbilityWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openAbilityWindow('interrupt')),
            new SimpleStep(game, () => this.choosePlacementOrder()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openWindowForAttachedEvents()),
            new SimpleStep(game, () => this.executePostHandler()),
            new SimpleStep(game, () => this.openWindowForAttachedEvents())
        ]);
        this.postHandlerFunc = postHandlerFunc;
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method, promptId) {
        return this.pipeline.handleMenuCommand(player, arg, method, promptId);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
    }

    automaticSaveWithDupes() {
        if(this.event.cancelled) {
            return;
        }

        for(let event of this.event.getConcurrentEvents()) {
            if(event.allowAutomaticSave() && this.game.saveWithDupe(event.card)) {
                event.cancel();
            }
        }
    }

    openAbilityWindow(abilityType) {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.event
        });
    }
    
    choosePlacementOrder() {
        if(this.event.cancelled) {
            return;
        }

        const orderableLocationsMap = new Map([
            ['draw deck', bottom => 'Select order to place cards ' + (!bottom ? 'on top of deck (top first)' : 'on bottom of deck (bottom first)')],
            ['shadows', bottom => 'Select order to place cards in shadows (' + (!bottom ? 'left' : 'right') + ' first)'],
            ['discard pile', bottom => 'Select order to place cards in discard pile (' + (!bottom ? 'top' : 'bottom') + ' first)'],
            ['dead pile', bottom => 'Select order to place cards in dead pile (' + (!bottom ? 'top' : 'bottom') + ' first)']
        ]);
        const locationsToEvents = new Map();

        this.event.getConcurrentEvents().filter(event => event.name === 'onCardPlaced' && event.orderable && orderableLocationsMap.has(event.location)).forEach(event => {
            const key = JSON.stringify({ location: event.location, bottom: event.bottom, owner: event.card.owner.name });
            let events = locationsToEvents.get(key) || [];
            events.push(event);
            locationsToEvents.set(key, events);
        });

        if(locationsToEvents.size === 0) {
            return;
        }

        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            for(let [key, events] of locationsToEvents.entries()) {
                const placeCardEventsForPlayer = events.filter(event => event.player === player);

                if(placeCardEventsForPlayer.length < 2) {
                    continue;
                }
                const cardsToEvents = new Map();
                for(const event of placeCardEventsForPlayer) {
                    cardsToEvents.set(event.card, event);
                }
                const groupBy = JSON.parse(key);
                const titleFunc = orderableLocationsMap.get(groupBy.location);
                this.game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: placeCardEventsForPlayer.length,
                    activePromptTitle: titleFunc(groupBy.bottom),
                    cardCondition: card => cardsToEvents.has(card),
                    onSelect: (player, selectedCards) => {
                        const orderedCards = selectedCards.reverse();
                        for(let order in orderedCards) {
                            const event = cardsToEvents.get(orderedCards[order]);
                            event.order = order;
                        }
                        return true;
                    },
                    onCancel: () => {
                        return true;
                    }
                });
            }
        }
    }

    executeHandler() {
        if(this.event.cancelled) {
            return;
        }

        this.event.executeHandler();
    }

    openWindowForAttachedEvents() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openInterruptWindowForAttachedEvents(this.event);
    }

    executePostHandler() {
        if(this.event.cancelled) {
            return;
        }

        this.event.executePostHandler();
        this.postHandlerFunc();
    }
}

module.exports = InterruptWindow;
