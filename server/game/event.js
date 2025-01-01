/**
 * An Event to indicate a reactable or interruptable game process, (eg. drawing a card or killing a character).
 * - Child events within this event are considered to be making up this event; reactions or interrupts to this event & its parents are to be shared.
 * - Cancelling this event will cancel all children events, but cancelling a child event will simply remove that event as part of this one.
 * - Child events can be replaced with new events (eg. Benjen Stark (Core) replacing placing him in the dead pile with shuffling him into the deck).
 * - This event will be "resolved" if it was not cancelled, was fully resolved & all child events resolved successfully.
 */
class Event {
    constructor(name, params = {}, handler = () => true, postHandler = () => true) {
        const { isFullyResolved, ...otherParams } = params;

        this.name = name;
        this.cancelled = false;
        this.invalid = false;
        this.handler = handler;
        this.postHandlers = [postHandler];
        this.childEvents = [];
        this.attachedEvents = [];
        this.params = otherParams;
        this.parent = null;
        this.cardStateWhenEventCreated = this.createCardSnapshot();
        this.isFullyResolved = isFullyResolved || (() => true);
        this.order = 0;

        this.assignParamProperties(otherParams);
    }

    createCardSnapshot() {
        return this.params.card && this.params.card.createSnapshot
            ? this.params.card.createSnapshot()
            : null;
    }

    assignParamProperties(params) {
        const overridingKeys = Object.entries(params)
            .map(([key]) => key)
            .filter((param) => this[param] !== undefined);
        if (overridingKeys.length !== 0) {
            throw new Error(
                `Event '${this.name}' cannot have params with keys as they already exist: ${overridingKeys.map((key) => `'${key}'`).join(', ')}`
            );
        }

        Object.assign(this, params);
    }

    get resolved() {
        return (
            !this.cancelled &&
            this.isFullyResolved(this) &&
            this.childEvents.every((event) => event.resolved)
        );
    }

    addChildEvent(event) {
        event.parent = this;
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        let fullName = suffix ? `${this.name}:${suffix}` : this.name;
        emitter.emit(fullName, this);

        for (let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    allowAutomaticSave() {
        return this.allowSave && this.automaticSaveWithDupe && !!this.card;
    }

    saveCard() {
        if (!this.card || this.cancelled) {
            return;
        }

        this.card.game.saveCard(this.card);
        this.cancel();
    }

    cancel() {
        this.cancelled = true;

        for (let event of this.childEvents) {
            // Disassociate the child with the parent so that indirect calls to
            // onChildCancelled are not made. This will prevent an infinite loop.
            event.parent = null;
            event.cancel();
        }

        this.childEvents = [];

        if (this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    replaceChildEvent(nameOrFunc, newEvent) {
        const findFunc =
            typeof nameOrFunc === 'string' ? (event) => event.name === nameOrFunc : nameOrFunc;

        // Check primary events to safely include simultaneous & atomic
        const childIndex = this.childEvents.findIndex((event) =>
            event.getPrimaryEvents().some(findFunc)
        );
        if (childIndex >= 0) {
            // Clear the old events parent first
            this.childEvents[childIndex].parent = null;
            this.childEvents.splice(childIndex, 1);
            this.addChildEvent(newEvent);
            return true;
        }
        return false;
    }

    replaceHandler(handler) {
        this.handler = handler;
    }

    checkExecuteValidity() {
        // When the card in which the event affects is moved before the event can start resolving, it should not execute (but is also not cancelled)
        if (
            this.params.card &&
            this.cardStateWhenEventCreated &&
            this.params.card.location !== this.cardStateWhenEventCreated.location
        ) {
            this.invalid = true;
        }

        for (let event of this.childEvents) {
            event.checkExecuteValidity();
        }
    }

    createSnapshot() {
        if (this.params.card && this.params.card.createSnapshot && this.params.snapshotName) {
            this[this.params.snapshotName] = this.params.card.createSnapshot();
        }
    }

    executeHandler() {
        this.queue = this.getConcurrentEvents().sort((a, b) => a.order - b.order);

        for (let event of this.queue) {
            event.createSnapshot();
            if (!event.invalid) {
                event.handler(event);
            }
        }
    }

    executePostHandler() {
        for (let postHandler of this.postHandlers) {
            postHandler(this);
        }
    }

    onChildCancelled(event) {
        this.childEvents = this.childEvents.filter((e) => e !== event);
    }

    getConcurrentEvents() {
        return this.childEvents.reduce(
            (concurrentEvents, event) => {
                return concurrentEvents.concat(event.getConcurrentEvents());
            },
            [this]
        );
    }

    getPrimaryEvents() {
        return [this];
    }

    thenAttachEvent(event) {
        this.attachedEvents.push(event);
    }

    thenExecute(func) {
        this.postHandlers.push(func);
        return this;
    }

    clearAttachedEvents() {
        for (let event of this.attachedEvents) {
            this.addChildEvent(event);
        }
        this.attachedEvents = [];
    }

    toString() {
        if (this.childEvents.length !== 0) {
            return `${this.name} + children(${this.childEvents.map((e) => e.toString()).join(', ')})`;
        }

        return this.name;
    }
}

export default Event;
