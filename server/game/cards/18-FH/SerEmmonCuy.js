import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class SerEmmonCuy extends DrawCard {
    // Ser Emmon Cuy (18016)
    // Bestow (1).
    // Reaction: After you initiate a challenge, discard 1 gold from Ser Emmon Cuy to raise the
    // claim value on your revealed plot card by 1 until the end of the challenge. Then, if he has
    // no gold, kill him. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.player
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            message:
                '{player} discards 1 gold from {source} to raise their claim value until the end of the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }))
            ]).then({
                condition: (context) => !context.source.hasToken(Tokens.gold),
                message: 'Then {player} kills {source}',
                gameAction: GameActions.kill((context) => ({ card: context.source }))
            })
        });
    }
}

SerEmmonCuy.code = '18016';

export default SerEmmonCuy;
