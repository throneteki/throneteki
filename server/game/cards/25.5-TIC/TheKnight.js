import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheKnight extends DrawCard {
    // The Knight (25083)
    // Pillage.
    // Action: During a challenge in which you are the attacking player, return 2 characters from
    // the defending player's discard pile to their owner's hand. Then, raise the claim value on
    // your revealed plot card by 1 until the end of the challenge. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim',
            limit: ability.limit.perChallenge(1),
            condition: (context) =>
                context.game.isDuringChallenge({ attackingPlayer: context.player }),
            target: {
                activePromptTitle: 'Select 2 characters',
                type: 'select',
                mode: 'exactly',
                numCards: 2,
                cardCondition: {
                    type: 'character',
                    location: 'discard pile',
                    condition: (card, context) =>
                        card.controller === context.game.currentChallenge.defendingPlayer
                }
            },
            message: {
                format: "{player} uses {source} to return {target} to {defendingPlayer}'s hand",
                args: {
                    defendingPlayer: (context) => context.game.currentChallenge.defendingPlayer
                }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.placeCard({ card, location: 'hand' }))
            ).then({
                message:
                    'Then, {player} raises the claim on their revealed plot card by 1 until the end of the challenge',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }))
            })
        });
    }
}

TheKnight.code = '25083';

export default TheKnight;
