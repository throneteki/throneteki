import DrawCard from '../../drawcard.js';

function getNumberOfOtherKnights(source) {
    return source.controller.getNumberOfCardsInPlay(
        (card) => card !== source && card.getType() === 'character' && card.hasTrait('Knight')
    );
}

class GreenAppleKnight extends DrawCard {
    // Green-Apple Knight (09012)
    // Green-Apple Knight gets +1 STR for each other Knight character you control.
    // While you control 2 or more other Knight characters, Green-Apple Knight does not kneel when
    // declared as an attacker.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                getNumberOfOtherKnights(context.source)
            )
        });
        this.persistentEffect({
            condition: (context) => getNumberOfOtherKnights(context.source) >= 2,
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

GreenAppleKnight.code = '09012';

export default GreenAppleKnight;
