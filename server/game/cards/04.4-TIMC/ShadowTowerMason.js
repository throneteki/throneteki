import DrawCard from '../../drawcard.js';

class ShadowTowerMason extends DrawCard {
    // Shadow Tower Mason (04065)
    // No attachments except Weapon.
    // While you control 3 or more [thenightswatch] locations and/or attachments, Shadow Tower Mason
    // gains a [military] and an [intrigue] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.getCardCount() >= 3,
            match: this,
            effect: [ability.effects.addIcon('military'), ability.effects.addIcon('intrigue')]
        });
    }

    getCardCount() {
        return this.controller.getNumberOfCardsInPlay(
            (card) =>
                ['attachment', 'location'].includes(card.getType()) &&
                card.isFaction('thenightswatch')
        );
    }
}

ShadowTowerMason.code = '04065';

export default ShadowTowerMason;
