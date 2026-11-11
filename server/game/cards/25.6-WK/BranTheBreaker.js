import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BranTheBreaker extends DrawCard {
    // Bran the Breaker (25112)
    // Unique [stark] location you control only.
    // Action: During a challenge in which you control 2 or more unique attacking [stark]
    // characters, kneel Bran the Breaker to raise the claim value on your revealed plot card by 1
    // until the end of the challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'stark',
            controller: 'current',
            unique: true
        });
        this.action({
            title: 'Raise claim by 1',
            condition: (context) =>
                context.game.isDuringChallenge({
                    match: (challenge) =>
                        challenge.attackers.filter((card) => context.source.isUniqueStark(card))
                            .length >= 2
                }),
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }

    isUniqueStark(card) {
        return (
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.isUnique() &&
            card.isFaction('stark')
        );
    }
}

BranTheBreaker.code = '25112';

export default BranTheBreaker;
