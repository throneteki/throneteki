import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OverwhelmingNumbers extends DrawCard {
    // Overwhelming Numbers (15022)
    // Play only during a challenge in which you control 2 or more attacking Dothraki characters.
    // Action: Put up to 2 Dothraki characters into play from your hand and/or discard pile knelt,
    // participating as attackers. At the end of the challenge, if any of those characters are still
    // in play, return them to your hand. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put characters into play',
            condition: (context) =>
                context.player.getNumberOfCardsInPlay({
                    trait: 'Dothraki',
                    type: 'character',
                    attacking: true
                }) >= 2,
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 2,
                cardCondition: (card, context) =>
                    card.isMatch({
                        trait: 'Dothraki',
                        type: 'character',
                        location: ['hand', 'discard pile']
                    }) && card.controller === context.player
            },
            message:
                '{player} plays {source} to put {target} into play knelt, participating as attackers',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) =>
                    GameActions.putIntoPlay({ card, player: context.player, kneeled: true }).then({
                        gameAction: GameActions.simultaneously([
                            GameActions.addToChallenge({ card }),
                            GameActions.lastingEffect(() => ({
                                duration: 'atEndOfChallenge',
                                match: card,
                                condition: () => card.location === 'play area',
                                effect: ability.effects.returnToHandIfStillInPlay(true, 'challenge')
                            }))
                        ])
                    })
                )
            ),
            max: ability.limit.perChallenge(1)
        });
    }
}

OverwhelmingNumbers.code = '15022';

export default OverwhelmingNumbers;
