const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class HereWeStand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search for Mormont cards',
            phase: 'dominance',
            condition: () => this.hasStandingMormontCharacter(),
            message:
                '{player} plays {source} to search the top 10 cards of their deck for any number of Bear Island, Bearskin Cloak, and House Mormont cards',
            gameAction: GameActions.search({
                title: 'Select any number of cards',
                topCards: 10,
                numToSelect: 10,
                match: {
                    condition: (card) =>
                        card.hasTrait('House Mormont') ||
                        card.name === 'Bear Island' ||
                        card.name === 'Bearskin Cloak'
                },
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.addToHand({ card }))
                )
            })
        });
    }

    hasStandingMormontCharacter() {
        return this.controller.anyCardsInPlay(
            (card) =>
                !card.kneeled && card.hasTrait('House Mormont') && card.getType() === 'character'
        );
    }
}

HereWeStand.code = '20030';

module.exports = HereWeStand;
