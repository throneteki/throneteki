import DrawCard from '../../drawcard.js';

class SwornToTheWatch extends DrawCard {
    // Sworn to the Watch (07022)
    // Attached character gains the [thenightswatch] affiliation.
    // While attached character has:
    // - a [military] icon, it gains the Ranger trait.
    // - an [intrigue] icon, it gains the Steward trait.
    // - a [power] icon, it gains the Builder trait.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addFaction('thenightswatch')
        });
        this.whileAttached({
            match: (card) => card.hasIcon('military'),
            effect: ability.effects.addTrait('Ranger')
        });
        this.whileAttached({
            match: (card) => card.hasIcon('intrigue'),
            effect: ability.effects.addTrait('Steward')
        });
        this.whileAttached({
            match: (card) => card.hasIcon('power'),
            effect: ability.effects.addTrait('Builder')
        });
    }
}

SwornToTheWatch.code = '07022';

export default SwornToTheWatch;
