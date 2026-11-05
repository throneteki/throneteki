import DrawCard from '../../drawcard.js';

class OldBearsRaven extends DrawCard {
    // Old Bear's Raven (02106)
    // Attached character gains stealth.
    // If attached character is Old Bear Mormont, he gains an [intrigue] icon.
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
