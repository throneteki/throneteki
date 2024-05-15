import DrawCard from '../../drawcard.js';

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.isAttacking() && this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

CerseiLannister.code = '01084';

export default CerseiLannister;
