import DrawCard from '../../drawcard.js';

class RoamingWolfpack extends DrawCard {
    // Roaming Wolfpack (06041)
    // Intimidate. No attachments.
    // While Roaming Wolfpack is attacking, each attacking Direwolf character gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card) =>
                card.isAttacking() && card.hasTrait('Direwolf') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(2)
        });
    }
}

RoamingWolfpack.code = '06041';

export default RoamingWolfpack;
