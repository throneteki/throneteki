import DrawCard from '../../drawcard.js';

class WinterfellCastle extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.controller === this.controller &&
                card.isUnique() &&
                card.isFaction('stark') &&
                card.getType() === 'character' &&
                this.noOtherHigherCostUniqueStarkCharacter(card),
            effect: [ability.effects.addTrait('Old Gods'), ability.effects.addKeyword('insight')]
        });
        let leftPlayCondition = (event) =>
            event.allowSave && event.card.canBeSaved() && event.card.hasTrait('Old Gods');
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: leftPlayCondition,
                onCardDiscarded: leftPlayCondition
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneelSpecific((context) => context.event.card),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }

    noOtherHigherCostUniqueStarkCharacter(card) {
        return !this.controller.anyCardsInPlay(
            (otherCard) =>
                otherCard !== card &&
                otherCard.isUnique() &&
                otherCard.isFaction('stark') &&
                otherCard.getType() === 'character' &&
                otherCard.getPrintedCost() > card.getPrintedCost()
        );
    }
}

WinterfellCastle.code = '22018';

export default WinterfellCastle;
