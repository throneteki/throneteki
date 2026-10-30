import DrawCard from '../../drawcard.js';

class WillasTyrell extends DrawCard {
    // Willas Tyrell (25055)
    // Insight.
    // Willas Tyrell contributes his STR to your side during any challenge in which a character you
    // control is attacking or defending alone.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) =>
                        context.game.isDuringChallenge({ attackingAlone: card }) ||
                        context.game.isDuringChallenge({ defendingAlone: card })
                ),
            effect: ability.effects.contributeCharacterStrength(this)
        });
    }
}

WillasTyrell.code = '25055';

export default WillasTyrell;
