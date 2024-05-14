import DrawCard from '../../drawcard.js';

class RoamingWolfpack extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) =>
                card.isAttacking() && card.hasTrait('Direwolf') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(2)
        });
    }
}

RoamingWolfpack.code = '06041';

export default RoamingWolfpack;
