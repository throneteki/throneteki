import DrawCard from '../../drawcard.js';

class BearskinCloak extends DrawCard {
    // Bearskin Cloak (14034)
    // Attached character gets +1 STR.
    // If attached character has the House Mormont trait, it gains stealth.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.whileAttached({
            match: (card) => card.hasTrait('House Mormont'),
            effect: ability.effects.addKeyword('Stealth')
        });
    }
}

BearskinCloak.code = '14034';

export default BearskinCloak;
