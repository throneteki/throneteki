import DrawCard from '../../drawcard.js';

class TheRedViper extends DrawCard {
    // The Red Viper (26087)
    // Shadow (5). Stealth.
    // Action: During a challenge in which The Red Viper is attacking, discard 1 card from shadows
    // to raise the claim value on your revealed plot card by 1 until the end of the challenge.
    // (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim',
            limit: ability.limit.perChallenge(1),
            condition: () => this.isAttacking(),
            cost: ability.costs.discardFromShadows(),
            message:
                '{player} uses {source} and discards {costs.discardFromShadows} from shadows to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

TheRedViper.code = '26087';

export default TheRedViper;
