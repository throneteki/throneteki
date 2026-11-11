import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hornvale extends DrawCard {
    // Hornvale (27026)
    // Reaction: After you win an [intrigue] challenge, kneel Hornvale to have the losing opponent
    // choose a card in their hand and place it facedown under Hornvale. If Hornvale leaves play,
    // return each card under it to its owner's hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.player
            },
            cost: ability.costs.kneelSelf(),
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                activePromptTitle: 'Select a card',
                cardCondition: { location: 'hand', controller: 'choosingPlayer' }
            },
            message: {
                format: '{player} kneels {source} to have {loser} place a card from their hand facedown under {source}',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.simultaneously([
                GameActions.placeCardUnderneath((context) => ({
                    card: context.target,
                    parentCard: context.source,
                    facedown: true
                })),
                GameActions.delayedEffect({
                    duration: 'untilTriggered',
                    when: {
                        onCardLeftPlay: (event, context) => event.card === context.source
                    },
                    message: {
                        format: "{player} returns {card} to {owner}'s hand as {source} left play",
                        args: {
                            card: (context) => context.target,
                            owner: (context) => context.target.owner
                        }
                    },
                    gameAction: GameActions.ifCondition({
                        condition: (context) => context.source.underneath.includes(context.target),
                        thenAction: GameActions.returnCardToHand((context) => ({
                            card: context.target
                        }))
                    })
                })
            ])
        });
    }
}

Hornvale.code = '27026';

export default Hornvale;
