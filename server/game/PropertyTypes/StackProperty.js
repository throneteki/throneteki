class StackProperty {
    constructor(defaultValue) {
        this.default = defaultValue;
        this.stack = [];
    }

    set(value, source) {
        const tracking = { value, source };
        if (!source) {
            this.stack = [tracking];
        } else {
            this.stack.push(tracking);
        }
    }

    remove(value, source) {
        const tracking = this.stack.findIndex((t) => t.value === value && t.source === source);
        if (tracking >= 0) {
            this.stack.splice(tracking, 1);
        }
    }

    get() {
        if (this.stack.length === 0) {
            return this.default;
        }
        return this.stack[this.stack.length - 1];
    }

    clone() {
        const clonedStack = new StackProperty(this.default);
        clonedStack.stack = this.stack.map((tracking) => ({ ...tracking }));
        return clonedStack;
    }
}

export default StackProperty;
