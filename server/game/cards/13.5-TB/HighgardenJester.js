import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import sample from 'lodash.sample';

class HighgardenJester extends DrawCard {
    // Highgarden Jester (13083)
    // Insight.
    // Forced Reaction: After Highgarden Jester draws a card using insight, place a random card from
    // your hand on top of your deck. (Choose a card from your hand and place it on top of your deck
    // instead if there is another Fool character in play.)
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardsDrawn: (event, context) =>
                    event.reason === 'insight' &&
                    event.source === context.source &&
                    context.player.hand.length > 0
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.game.anyCardsInPlay(
                        (card) =>
                            card !== context.source &&
                            card.isMatch({ type: 'character', trait: 'Fool' })
                    ),
                thenAction: {
                    message:
                        '{player} is forced by {source} to choose a card from their hand and place it on top of their deck',
                    gameAction: GameActions.chooseCards({
                        cardCondition: (card, context) =>
                            card.controller === context.player && card.location === 'hand',
                        gameAction: (card) => GameActions.placeCard({ card, location: 'draw deck' })
                    })
                },
                elseAction: {
                    message:
                        '{player} is forced by {source} to place a random card from their hand on top of their deck',
                    gameAction: GameActions.placeCard((context) => ({
                        card: sample(context.player.hand),
                        location: 'draw deck'
                    }))
                }
            })
        });
    }
}

HighgardenJester.code = '13083';

export default HighgardenJester;
