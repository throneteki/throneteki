import DrawCard from '../../drawcard.js';

class MellarioOfNorvos extends DrawCard {
    // Mellario of Norvos (18007)
    // While you have Arianne Martell in your hand, reduce the cost to marshal her by 1.
    // While you control:
    // - Doran Martell, he gains: "immune to opponents' plot effects."
    // - Quentyn Martell, he gets +2 STR.
    // - Trystane Martell, he gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Doran Martell',
            effect: ability.effects.immuneTo(
                (card, arg, context) =>
                    card.controller !== context.source.controller && card.getType() === 'plot'
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

export default MellarioOfNorvos;
