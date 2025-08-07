class Restriction {
    constructor(name) {
        this.name = name;
    }

    isActive() {
        return true;
    }

    isMatch() {
        return false;
    }
}

export default Restriction;
