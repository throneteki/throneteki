import DrawCard from '../../drawcard.js';

class CerseiLannister extends DrawCard {
    // Cersei Lannister (01084)
    // While Cersei Lannister is attacking during an [intrigue] challenge, raise the claim value on
    // your revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() &&
                context.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

CerseiLannister.code = '01084';

export default CerseiLannister;
