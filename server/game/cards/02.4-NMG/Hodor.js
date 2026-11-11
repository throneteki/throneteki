import DrawCard from '../../drawcard.js';

class Hodor extends DrawCard {
    // Hodor (02061)
    // No attachments.
    // Hodor cannot be declared as an attacker unless you control Bran Stark.
    // Hodor does not contribute his STR to your total for dominance.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay((card) => card.name === 'Bran Stark'),
            match: this,
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotContributeToDominance()
        });
    }
}

Hodor.code = '02061';

export default Hodor;
