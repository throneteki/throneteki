import DrawCard from '../../drawcard.js';

class TywinLannister extends DrawCard {
    // Tywin Lannister (01090)
    // Renown.
    // Tywin Lannister gets +1 STR for each gold in your gold pool.
    // +2 Income.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.controller.gold
            )
        });
        this.plotModifiers({
            gold: 2
        });
    }
}

TywinLannister.code = '01090';

export default TywinLannister;
