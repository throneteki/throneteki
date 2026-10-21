import DrawCard from '../../drawcard.js';

class CunningSteward extends DrawCard {
    // Cunning Steward (11025)
    // Shadow (3).
    // While you are the defending player, Cunning Steward gains a [military] and a [power] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            match: this,
            effect: [ability.effects.addIcon('military'), ability.effects.addIcon('power')]
        });
    }
}

CunningSteward.code = '11025';

export default CunningSteward;
