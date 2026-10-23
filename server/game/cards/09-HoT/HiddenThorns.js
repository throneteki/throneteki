import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HiddenThorns extends DrawCard {
    // Hidden Thorns (09024)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, the losing opponent chooses
    // and discards 2 cards from his or her hand. Then, if you control The Queen of Thorns, return
    // Hidden Thorns to your hand instead of placing it in your discard pile. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} plays {source} to make {loser} choose and discard 2 cards',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                mode: 'exactly',
                numCards: 2,
                title: 'Select 2 cards',
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer && card.location === 'hand',
                gameAction: (card) => GameActions.discardCard({ card })
            }).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.player.anyCardsInPlay(
                            (card) => card.name === 'The Queen of Thorns'
                        ),
                    thenAction: {
                        message:
                            '{player} returns {source} to their hand instead of their discard pile',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'custom',
                            until: {
                                onCardPlayed: (event) => event.card === context.source
                            },
                            targetLocation: 'any',
                            match: context.source,
                            effect: ability.effects.setEventPlacementLocation('hand')
                        }))
                    }
                })
            })
        });
    }
}

HiddenThorns.code = '09024';

export default HiddenThorns;
