import DrawCard from '../../drawcard.js';

function noOtherBigNonArmy(source) {
    return !source.controller.anyCardsInPlay(
        (card) => card !== source.parent && !card.hasTrait('Army') && card.getPrintedCost() >= 6
    );
}

class ValyrianSteelArmor extends DrawCard {
    // Valyrian Steel Armor (21006)
    // If attached character is Euron Crow's Eye, he gains insight.
    // While you control no non-Army characters with printed cost 6 or higher other than attached
    // character, attached character cannot be killed or discarded from play.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => noOtherBigNonArmy(context.source),
            effect: [ability.effects.cannotBeKilled(), ability.effects.cannotBeDiscarded()]
        });
        this.whileAttached({
            match: (card) => card.name === "Euron Crow's Eye",
            effect: ability.effects.addKeyword('insight')
        });
    }
}

ValyrianSteelArmor.code = '21006';

export default ValyrianSteelArmor;
