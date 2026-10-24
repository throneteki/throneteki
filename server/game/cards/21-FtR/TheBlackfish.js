import DrawCard from '../../drawcard.js';

class TheBlackfish extends DrawCard {
    // The Blackfish (21016)
    // Renown. Stealth.
    // Each [stark] Army character you control gains an [intrigue] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' && card.hasTrait('Army') && card.isFaction('stark'),
            effect: ability.effects.addIcon('intrigue')
        });
    }
}

TheBlackfish.code = '21016';

export default TheBlackfish;
