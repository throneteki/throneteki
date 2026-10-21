import DrawCard from '../../drawcard.js';

class MaesterLuwin extends DrawCard {
    // Maester Luwin (02003)
    // While you control:
    // - Robb Stark, he gains insight.
    // - Jon Snow, he gains stealth.
    // - Bran Stark, he gains: "immune to opponents' plot effects."
    // - Rickon Stark, he gains pillage.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Robb Stark',
            effect: ability.effects.addKeyword('Insight')
        });

        this.persistentEffect({
            match: (card) => card.name === 'Jon Snow',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.persistentEffect({
            match: (card) => card.name === 'Bran Stark',
            effect: ability.effects.immuneTo(
                (card, arg, context) =>
                    card.controller !== context.source.controller && card.getType() === 'plot'
            )
        });

        this.persistentEffect({
            match: (card) => card.name === 'Rickon Stark',
            effect: ability.effects.addKeyword('Pillage')
        });
    }
}

MaesterLuwin.code = '02003';

export default MaesterLuwin;
