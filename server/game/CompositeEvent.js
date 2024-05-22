import uuid from 'uuid';
import Event from './event.js';

/**
 * CompositeEvent is an event that is made up of other inner events, but is also an emittable event itself
 * - Eg. onCharacterKilled -> onCardPlaced + onLeavePlay
 * - Each inner child event is named, making replacement easier
 * - Cancelling any child will cancel the whole composite event
 * - Parameters of children are shared within composite event
 */
class CompositeEvent extends Event {
    constructor(name, params = {}, postHandler = () => true) {
        super(name, params, undefined, postHandler);

        this.childEventsMap = new Map();
    }

    get childEvents() {
        return [...this.childEventsMap.values()];
    }

    set childEvents(val) {
        return;
    }

    get childEvent() {
        return Object.fromEntries(this.childEventsMap.entries());
    }

    get resolved() {
        return (
            !this.cancelled &&
            this.isFullyResolved(this) &&
            this.childEvents.every((event) => event.resolved)
        );
    }

    addChildEvent(event) {
        // Add un-named inner event (with uuid as name)
        this.setChildEvent(uuid.v1(), event);
    }

    setChildEvent(name, event) {
        this.params = Object.assign({}, event.params, this.params);
        Object.assign(this, this.params);

        event.parent = this;
        this.childEventsMap.set(name, event);
    }

    replaceChildEvent(childEvent, newEvent) {
        for (const [name, event] of this.childEventsMap.entries()) {
            if (event === childEvent) {
                childEvent.parent = null;
                this.setChildEvent(name, newEvent);
                return;
            }
        }
    }

    emitTo(emitter, suffix) {
        let fullName = suffix ? `${this.name}:${suffix}` : this.name;
        emitter.emit(fullName, this);

        for (let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    cancel() {
        this.cancelled = true;

        for (let event of this.childEvents) {
            // Disassociate the child with the parent so that indirect calls to
            // onChildCancelled are not made. This will prevent an infinite loop.
            event.parent = null;
            event.cancel();
        }

        this.childEventsMap.clear();

        if (this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    onChildCancelled(event) {
        for (const [name, childEvent] of this.childEventsMap.entries()) {
            if (event === childEvent) {
                childEvent.parent = null;
                this.childEventsMap.delete(name);

                this.cancel();
                return;
            }
        }
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
            return `composite(${this.name} > ${this.childEvents.map((e) => e.toString()).join(' + ')})`;
        }

        return `composite(${this.name})`;
    }
}

export default CompositeEvent;
