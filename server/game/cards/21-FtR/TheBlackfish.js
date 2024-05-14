import DrawCard from '../../drawcard.js';

class TheBlackfish extends DrawCard {
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
