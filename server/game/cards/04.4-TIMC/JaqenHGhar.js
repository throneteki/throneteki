import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class JaqenHGhar extends DrawCard {
    // Jaqen H'ghar (04077)
    // Reaction: After Jaqen H'ghar enters play, place a Valar Morghulis token on up to 3 different
    // unique characters. If Jaqen H'ghar leaves play, discard those tokens from play.
    // Reaction: After you win a challenge in which Jaqen H'ghar is attacking alone, choose and kill
    // a character with a Valar Morghulis token.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isUnique()
            },
            message: '{player} uses {source} to place Valar Morghulis tokens on {target}',
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.target.map((card) =>
                        GameActions.placeToken({ card, token: Tokens.valarmorghulis })
                    )
                ),
                GameActions.delayedEffect({
                    duration: 'untilTriggered',
                    when: {
                        onCardLeftPlay: (event, context) => event.card === context.source
                    },
                    message:
                        '{player} discards the Valar Morghulis tokens from {target} as {source} left play',
                    gameAction: GameActions.simultaneously((context) =>
                        context.target.map((card) =>
                            GameActions.discardToken({ card, token: Tokens.valarmorghulis })
                        )
                    )
                })
            ])
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.game.isDuringChallenge({
                        winner: context.player,
                        attackingAlone: context.source
                    })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasToken(Tokens.valarmorghulis),
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

JaqenHGhar.code = '04077';

export default JaqenHGhar;
