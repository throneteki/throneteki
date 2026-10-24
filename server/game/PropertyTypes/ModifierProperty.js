class ModifierProperty {
    constructor() {
        this.modifiers = new Map();
    }

    get value() {
        return [...this.modifiers.values()].reduce((sum, value) => sum + value, 0);
    }

    set(source, value) {
        this.modifiers.set(source, value);
    }

    remove(source) {
        this.modifiers.delete(source);
    }

    add(value, source = 'manual') {
        this.set(source, (this.modifiers.get(source) || 0) + value);
    }

    clone() {
        const clone = new ModifierProperty();
        clone.modifiers = new Map(this.modifiers);
        return clone;
    }
}

export default ModifierProperty;
