import DrawCard from '../../drawcard.js';

class FormerChampion extends DrawCard {
    // Former Champion (24026)
    // Renown.
    // Former Champion gets -1 STR for each power it has.
    // While Former Champion's STR is 3 or lower, it gains a [power] icon and stealth.
    // While Former Champion's STR is 1 or lower, it gains an [intrigue] icon and intimidate.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => context.source.power * -1)
        });
        this.persistentEffect({
            condition: (context) => context.source.getStrength() <= 3,
            match: this,
            effect: [ability.effects.addIcon('power'), ability.effects.addKeyword('Stealth')]
        });
        this.persistentEffect({
            condition: (context) => context.source.getStrength() <= 1,
            match: this,
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addKeyword('Intimidate')]
        });
    }
}

FormerChampion.code = '24026';

export default FormerChampion;
