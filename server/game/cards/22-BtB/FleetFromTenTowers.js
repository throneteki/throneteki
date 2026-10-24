import DrawCard from '../../drawcard.js';

class FleetFromTenTowers extends DrawCard {
    // Fleet from Ten Towers (22005)
    // Assault. No attachments.
    // While Fleet from Ten Towers is attacking an opponent whose reserve value is 4 or lower, it
    // gets +3 STR and gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() &&
                context.game.isDuringChallenge({
                    match: (challenge) => challenge.defendingPlayer.getReserve() <= 4
                }),
            match: this,
            effect: [ability.effects.modifyStrength(3), ability.effects.addKeyword('Renown')]
        });
    }
}

FleetFromTenTowers.code = '22005';

export default FleetFromTenTowers;
