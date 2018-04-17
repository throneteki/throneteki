class BlankingProperty {
    constructor() {
        this.blanks = {};
    }

    addBlankingSource(source, includingTraits = false) {
        this.blanks[source.uuid] = { source: source, includingTraits: includingTraits };
    }

    removeBlankingSource(source) {
        delete this.blanks[source.uuid];
    }

    isBlank(includingTraits = false) {
        return Object.values(this.blanks).some(blank => !includingTraits || (includingTraits && blank.includingTraits));
    }
}

module.exports = BlankingProperty;
