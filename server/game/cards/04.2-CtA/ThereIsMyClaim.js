import DrawCard from '../../drawcard.js';

class ThereIsMyClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim value by 1',
            max: ability.limit.perChallenge(1),
            phase: 'challenge',
            condition: () => this.game.isDuringChallenge(),
            cost: ability.costs.revealCards(
                4,
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    card.location === 'hand'
            ),
            message:
                '{player} plays {source} and reveals {costs.reveal} from their hand to raise their claim value by 1 until the end of the challenge',
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

ThereIsMyClaim.code = '04024';

export default ThereIsMyClaim;
