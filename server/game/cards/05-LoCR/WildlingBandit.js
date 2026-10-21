import DrawCard from '../../drawcard.js';

class WildlingBandit extends DrawCard {
    // Wildling Bandit (05041)
    // While Wildling Bandit is attacking an opponent with more gold in his or her gold pool than
    // you, it gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() &&
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.defendingPlayer.gold > this.controller.gold
                }),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

WildlingBandit.code = '05041';

export default WildlingBandit;
