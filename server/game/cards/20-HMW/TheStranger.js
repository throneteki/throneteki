import PlotCard from '../../plotcard.js';

class TheStranger extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.choosingPlayer
            },
            handler: (context) => {
                const uniqueCards = this.getChosenCards(context);
                const printedCosts = uniqueCards.map((card) => card.getPrintedCost());
                let characters = this.game.filterCardsInPlay(
                    (card) =>
                        printedCosts.includes(card.getPrintedCost()) &&
                        card.getType() === 'character' &&
                        card.hasPrintedCost()
                );
                this.game.killCharacters(characters);
            }
        });
    }

    getChosenCards(context) {
        const cards = context.targets.selections
            .map((selection) => selection.value)
            .filter((card) => !!card);
        return [...new Set(cards)];
    }
}

TheStranger.code = '20059';

export default TheStranger;
