import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WinterfellCastle extends DrawCard {
    // Winterfell Castle (22018)
    // Each character with the highest printed cost among unique [stark] characters you control
    // gains the Old Gods trait and insight.
    // Interrupt: When an Old Gods card would be killed or discarded from play, kneel that card to
    // save it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.controller === context.source.controller &&
                card.isUnique() &&
                card.isFaction('stark') &&
                card.getType() === 'character' &&
                context.source.noOtherHigherCostUniqueStarkCharacter(card),
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
            message: {
                format: '{player} uses {source} and kneels {card} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
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
