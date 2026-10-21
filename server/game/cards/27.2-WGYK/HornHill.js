import DrawCard from '../../drawcard.js';

class HornHill extends DrawCard {
    // Horn Hill (27036)
    // During the first challenge you initiate each phase, raise the claim value on your revealed
    // plot card by 1.
    // +1 Initiative.
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
