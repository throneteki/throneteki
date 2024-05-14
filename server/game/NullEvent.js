class NullEvent {
    constructor() {
        this.attachedEvents = [];
        this.cancelled = false;
        this.invalid = false;
    }

    get resolved() {
        return false;
    }

    addChildEvent() {}

    emitTo() {}

    allowAutomaticSave() {
        return false;
    }

    cancel() {
        this.cancelled = true;
    }

    replaceHandler() {}

    checkExecuteValidity() {
        this.invalid = true;
    }

    executeHandler() {}

    executePostHandler() {}

    getConcurrentEvents() {
        return [this];
    }

    getPrimaryEvents() {
        return [this];
    }

    thenAttachEvent() {}

    thenExecute() {
        return this;
    }

    clearAttachedEvents() {}
}

module.exports = NullEvent;
