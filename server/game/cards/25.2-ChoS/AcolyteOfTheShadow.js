import DrawCard from '../../drawcard.js';

class AcolyteOfTheShadow extends DrawCard {
    // Acolyte of the Shadow (25021)
    // While an opponent controls a card in shadows, Acolyte of the Shadow gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game
                    .getOpponents(context.source.controller)
                    .some((opponent) => opponent.shadows.length > 0),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }
}

AcolyteOfTheShadow.code = '25021';

export default AcolyteOfTheShadow;
