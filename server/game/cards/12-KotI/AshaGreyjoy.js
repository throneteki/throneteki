import DrawCard from '../../drawcard.js';

class AshaGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card !== this &&
                card.isUnique() &&
                card.hasTrait('ironborn') &&
                card.getType() === 'character',
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

AshaGreyjoy.code = '12003';

export default AshaGreyjoy;
