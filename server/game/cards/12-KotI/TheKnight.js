import DrawCard from '../../drawcard.js';

class TheKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    attackingPlayer: this.controller,
                    attackingAlone: this
                }),
            match: this,
            effect: [ability.effects.addKeyword('renown'), ability.effects.addKeyword('stealth')]
        });
    }
}

TheKnight.code = '12004';

export default TheKnight;
