import DrawCard from '../../drawcard.js';

class TheRedViper extends DrawCard {
    // The Red Viper (06095)
    // Renown.
    // While The Red Viper is attacking, each defending character with fewer than 2 challenge icons
    // does not contribute its STR to the challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card) =>
                card.isDefending() && card.getType() === 'character' && card.getNumberOfIcons() < 2,
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheRedViper.code = '06095';

export default TheRedViper;
