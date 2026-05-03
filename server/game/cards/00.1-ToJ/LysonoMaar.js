import DrawCard from '../../drawcard.js';

class LysonoMaar extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 1 }),
            effect: ability.effects.declareDefendersBeforeAttackers()
        });
    }
}

LysonoMaar.code = '00249';

export default LysonoMaar;
