const uuid = require('uuid');
const ReservedEventParamKeys = [
    'attachedEvents',
    'cancelled',
    'childEvents',
    'handler',
    'name',
    'params',
    'parent',
    'postHandlers',
    'cardStateWhenEventCreated'
];

class CompositeEvent {
    constructor(name, params = {}, postHandler = () => true) {
        const { isFullyResolved, ...otherParams } = params;

        this.name = name;
        this.cancelled = false;
        this.invalid = false;
        this.handler = () => true;
        this.postHandlers = [postHandler];
        this.childEventsMap = new Map();
        this.attachedEvents = [];
        this.params = otherParams;
        this.isFullyResolved = isFullyResolved || (() => true);

        this.assignParamProperties(otherParams);

        if (this.params.card && this.params.card.createSnapshot) {
            this.cardStateWhenEventCreated = this.params.card.createSnapshot();
        }

        // ISSUE: Properties within primaryEvent & innerEvents need to be shared, rather than sharing all properties within here.
        // eg. If innerEvent[0].automaticSaveWithDupe is being fetched, and is undefined, then it should search primaryEvent & the
        //     other innerEvents for an automaticSaveWithDupe that isn't undefined. If none exist, it's actually undefined.

        // Proxy allows property gets/sets to be obtained from & propogated to inner events
        // return new Proxy(this, {
        //     get: function(target, prop) {
        //         const value = target[prop];
        //         if(value) {
        //             return value;
        //         }
        //         // Get the property, starting at the primary event, then looping through inner events
        //         for(const event of target.childEvents) {
        //             const property = event[prop];
        //             if(property) {
        //                 return property;
        //             }
        //         }
        //         return undefined;
        //     },
        //     set: function(target, prop, value) {
        //         // Find if the property exists already & set, starting at the primary event, then looping through inner events
        //         for(const event of target.childEvents) {
        //             const property = event[prop];
        //             if(property) {
        //                 event[prop] = value;
        //                 return true;
        //             }
        //         }
        //         // Otherwise, set property on composite event
        //         return true;
        //     }
        // });
    }

    assignParamProperties(params) {
        let reservedKeys = ReservedEventParamKeys.filter((key) => !!params[key]);
        if (reservedKeys.length !== 0) {
            throw new Error(
                `Event '${this.name}' cannot have params with keys: ${reservedKeys.map((key) => `'${key}'`).join(', ')}`
            );
        }

        Object.assign(this, params);
    }

    get childEvents() {
        return [...this.childEventsMap.values()];
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

    replaceChildEvent(name, event) {
        if (this.childEventsMap.has(name)) {
            this.childEventsMap.get(name).parent = null;
            this.setChildEvent(name, event);
        }
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

        this.childEventsMap.clear();

        if (this.parent) {
            this.parent.onChildCancelled(this);
        }
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

    executeHandler() {
        if (this.params.card && this.params.card.createSnapshot && this.params.snapshotName) {
            this[this.params.snapshotName] = this.params.card.createSnapshot();
        }

        for (let event of this.childEvents) {
            event.executeHandler();
        }
    }

    executePostHandler() {
        for (let postHandler of this.postHandlers) {
            postHandler(this);
        }
    }

    onChildCancelled(event) {
        const childEventEntry = [...this.childEventsMap.entries()].find(
            ([, value]) => value === event
        );
        if (childEventEntry) {
            this.childEventsMap.delete(childEventEntry[0]);
        }
        this.cancel();
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
            return `composite(${this.name} > ${this.childEvents.map((e) => e.toString()).join(' + ')})`;
        }

        return `composite(${this.name})`;
    }
}

export default CompositeEvent;
