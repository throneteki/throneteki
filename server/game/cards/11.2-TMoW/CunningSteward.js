import DrawCard from '../../drawcard.js';

class CunningSteward extends DrawCard {
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
