import DrawCard from '../../drawcard.js';

class TheBloodroyal extends DrawCard {
    // The Bloodroyal (12030)
    // [martell] character only.
    // While you are not the first player, attached character gains stealth and renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'martell' });
        this.whileAttached({
            condition: (context) => !context.source.controller.firstPlayer,
            effect: [ability.effects.addKeyword('stealth'), ability.effects.addKeyword('renown')]
        });
    }
}

TheBloodroyal.code = '12030';

export default TheBloodroyal;
