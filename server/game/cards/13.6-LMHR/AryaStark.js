import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class AryaStark extends DrawCard {
    // Arya Stark (13101)
    // Shadow (4). Stealth.
    // Reaction: After Arya Stark enters play, place a prayer token on up to 5 different characters
    // you don't control. If Arya Stark leaves play, discard those tokens.
    // Reaction: After a character with a prayer token is killed, stand Arya Stark and draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: 'upTo',
                numCards: 5,
                activePromptTitle: 'Select up to 5 characters',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.player
            },
            message: '{player} uses {source} to place prayer tokens on {target}',
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.target.map((card) =>
                        GameActions.placeToken({ card, token: Tokens.prayer })
                    )
                ),
                GameActions.delayedEffect({
                    duration: 'untilTriggered',
                    when: {
                        onCardLeftPlay: (event, context) => event.card === context.source
                    },
                    message:
                        '{player} discards the prayer tokens from {target} as {source} left play',
                    gameAction: GameActions.simultaneously((context) =>
                        context.target.map((card) =>
                            GameActions.discardToken({ card, token: Tokens.prayer })
                        )
                    )
                })
            ])
        });

        this.reaction({
            when: {
                onCharacterKilled: (event) => event.cardStateWhenKilled.hasToken(Tokens.prayer)
            },
            message: '{player} uses {source} to {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.source })),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

AryaStark.code = '13101';

export default AryaStark;
