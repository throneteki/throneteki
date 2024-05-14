import DrawCard from '../../drawcard.js';

class TheRedViper extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) =>
                card.isDefending() && card.getType() === 'character' && card.getNumberOfIcons() < 2,
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheRedViper.code = '06095';

export default TheRedViper;
