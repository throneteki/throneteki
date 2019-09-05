class NullEvent {
    get resolved() {
        return false;
    }

    thenExecute() {
        return this;
    }
}

module.exports = NullEvent;
