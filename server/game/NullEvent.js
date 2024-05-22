class NullEvent {
    constructor() {
        this.attachedEvents = [];
        this.cancelled = false;
        this.invalid = false;
        this.order = 0;
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

    replace() {}

    replaceChildEvent() {}

    replaceHandler() {}

    checkExecuteValidity() {
        this.invalid = true;
    }

    createSnapshot() {}

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

export default NullEvent;
