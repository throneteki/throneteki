const DrawCard = require('../../drawcard.js');

class MellarioOfNorvos extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Doran Martell',
            effect: ability.effects.immuneTo(
                (card) => card.controller !== this.controller && card.getType() === 'plot'
            )
        });

        this.persistentEffect({
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: (card) => card.name === 'Arianne Martell'
            })
        });

        this.persistentEffect({
            match: (card) => card.name === 'Quentyn Martell',
            effect: ability.effects.modifyStrength(2)
        });

        this.persistentEffect({
            match: (card) => card.name === 'Trystane Martell',
            effect: ability.effects.addKeyword('Insight')
        });
    }
}

MellarioOfNorvos.code = '18007';

module.exports = MellarioOfNorvos;
