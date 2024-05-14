import DrawCard from '../../drawcard.js';

class FleetFromTenTowers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() &&
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.defendingPlayer.getTotalReserve() <= 4
                }),
            match: this,
            effect: [ability.effects.modifyStrength(3), ability.effects.addKeyword('Renown')]
        });
    }
}

FleetFromTenTowers.code = '22005';

export default FleetFromTenTowers;
