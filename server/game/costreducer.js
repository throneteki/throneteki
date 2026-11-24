class CostReducer {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.uses = 0;
        this.limit = properties.limit;
        this.match = properties.match || (() => true);
        this.amount = properties.amount || 1;
        this.playingTypes = this.buildPlayingTypes(properties);
        if (this.limit) {
            this.limit.registerEvents(game);
        }
    }

    buildPlayingTypes(properties) {
        let playingTypes = Array.isArray(properties.playingTypes)
            ? properties.playingTypes
            : [properties.playingTypes];

        // Reducers that reduce marshalling any card with no characteristic
        // requirements should also reduce marshalling any card into shadows, and are used up by
        // marshalling a duplicate. See the following rulings on Hizdahr zo Loraq:
        // http://www.cardgamedb.com/forums/index.php?/topic/39948-ruling-hizdahr-zo-loraq/
        // https://github.com/throneteki/throneteki/issues/2278
        if (!properties.match && playingTypes.includes('marshal')) {
            return playingTypes.concat('marshalIntoShadows', 'marshalDuplicate');
        }

        return playingTypes;
    }

    canReduce(playingType, card) {
        if (this.limit && this.limit.isAtMax()) {
            return false;
        }

        if (
            playingType === 'play' &&
            this.playingTypes.includes('outOfShadows') &&
            card.location === 'shadows'
        ) {
            return !!this.match(asPlayed(card));
        }

        return this.playingTypes.includes(playingType) && !!this.match(asPlayed(card));
    }

    getAmount(card) {
        if (typeof this.amount === 'function') {
            return this.amount(asPlayed(card), this.source) || 0;
        }

        return this.amount;
    }

    markUsed() {
        if (this.limit) {
            this.limit.increment();
        }
    }

    isExpired() {
        return !!this.limit && this.limit.isAtMax() && !this.limit.isRepeatable();
    }

    unregisterEvents() {
        if (this.limit) {
            this.limit.unregisterEvents(this.game);
        }
    }
}

// A facedown card that can be marshaled or played as if it were in hand (Valyrian's Crew) is
// matched by its printed attributes, not the ones it has while facedown in play.
function asPlayed(card) {
    return card.isFacedownInPlay?.() ? card.createSnapshot() : card;
}

export default CostReducer;
