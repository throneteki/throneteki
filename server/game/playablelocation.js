class PlayableLocation {
    constructor(playingType, predicate) {
        this.playingType = playingType;
        this.predicate = predicate;
    }

    contains(card) {
        return this.predicate(card);
    }
}

export default PlayableLocation;
