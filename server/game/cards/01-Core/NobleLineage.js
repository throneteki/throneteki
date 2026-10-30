import DrawCard from '../../drawcard.js';

class NobleLineage extends DrawCard {
    // Noble Lineage (01036)
    // Attached character gains a [power] icon.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('power')
        });
    }
}

NobleLineage.code = '01036';

export default NobleLineage;
