import DrawCard from '../../drawcard.js';

class OldBearsRaven extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.name === 'Old Bear Mormont',
            effect: ability.effects.addIcon('intrigue')
        });
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

OldBearsRaven.code = '02106';

export default OldBearsRaven;
