import DrawCard from '../../drawcard.js';

class HornHill extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 1 }),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

HornHill.code = '27036';

export default HornHill;
