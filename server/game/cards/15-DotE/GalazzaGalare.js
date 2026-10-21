import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GalazzaGalare extends DrawCard {
    // Galazza Galare (15006)
    // Reaction: After you marshal Galazza Galare, search the top 10 cards of your deck for, either:
    // a [targaryen] character with printed cost 6 or higher, or up to 3 [targaryen] characters with
    // printed cost 2 or lower. Reveal each searched-for card and add it to your hand. Shuffle your
    // deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.playingType === 'marshal' && event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for one or more Targaryen characters',
            gameAction: GameActions.search({
                title: 'Select up to 3 characters',
                numToSelect: 3,
                topCards: 10,
                match: {
                    faction: 'targaryen',
                    type: 'character',
                    condition: (card, context) => this.hasValidPrintedCost(card, context)
                },
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.addToHand({ card }))
                )
            })
        });
    }

    hasValidPrintedCost(card, context) {
        const { selectedCards } = context;
        const printedCost = card.getPrintedCost();

        if (selectedCards.length === 0) {
            return printedCost >= 6 || printedCost <= 2;
        }

        if (selectedCards.some((card) => card.getPrintedCost() >= 6)) {
            // Only allow a single 6+ cost card
            return false;
        }

        return printedCost <= 2;
    }
}

GalazzaGalare.code = '15006';

export default GalazzaGalare;
