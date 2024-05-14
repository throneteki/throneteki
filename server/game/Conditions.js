class Conditions {
    static allInPlay({ player, type, match }) {
        const cardsInPlay = player.filterCardsInPlay({ type });

        if (cardsInPlay.length === 0) {
            return false;
        }

        return cardsInPlay.every((card) => card.isMatch(match));
    }

    static allCharactersAreStark({ player }) {
        return this.allInPlay({
            player,
            type: 'character',
            match: { faction: 'stark' }
        });
    }

    static allCardsAreStark({ player }) {
        return this.allInPlay({
            player,
            type: ['attachment', 'character', 'location'],
            match: { faction: 'stark' }
        });
    }
}

export default Conditions;
