class NullEvent {
    constructor() {
        this.attachedEvents = [];
        this.cancelled = false;
    }

    get resolved() {
        return false;
    }

    addChildEvent() {
    }

    emitTo() {
    }

    allowAutomaticSave() {
        return false;
    }

    cancel() {
        this.cancelled = true;
    }

    replaceHandler() {
    }

    executeHandler() {
    }

    executePostHandler() {
    }

    getConcurrentEvents() {
        return [this];
    }

    getPrimaryEvents() {
        return [this];
    }

    thenAttachEvent() {
    }

    thenExecute() {
        return this;
    }

    clearAttachedEvents() {
    }
}

module.exports = NullEvent;
