const GameActions = require('../../GameActions');
const DrawCard = require('../../drawcard');

class TasteTheBlood extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: event => this.meetsCommonCondition(event.card),
                onSacrificed: event => event.card.getType() === 'character' && this.meetsCommonCondition(event.card)
            },
            message: {
                format: '{player} plays {source} to stand {cards}',
                args: { cards: context => this.getStandingCards(context) }
            },
            gameAction: GameActions.simultaneously(context => this.getStandingCards(context).map(card => GameActions.standCard({ card })))
        });
    }

    meetsCommonCondition(card) {
        return card.controller !== this.controller && card.hasPrintedCost();
    }

    getStandingCards(context) {
        let eventCard = context.event.cardStateWhenKilled || context.event.cardStateWhenSacrificed;
        return context.player.filterCardsInPlay(card => card.hasTrait('Old Gods') && card.hasPrintedCost() && card.getPrintedCost() <= eventCard.getPrintedCost());
    }
}

TasteTheBlood.code = '25571';
TasteTheBlood.version = '1.0';

module.exports = TasteTheBlood;
