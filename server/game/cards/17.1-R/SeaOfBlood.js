import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SeaOfBlood extends AgendaCard {
    // Sea of Blood (17149)
    // You cannot include neutral events in your deck.
    // Action: Discard 1 blood token from Sea of Blood to reduce the cost of the next event you play
    // this phase by 2.
    // Reaction: After you win a [military] challenge by 5 or more STR, kneel your faction card to
    // place a blood token on Sea of Blood and search the top 10 cards of your deck for an event,
    // reveal it, and add it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next event by 2',
            clickToActivate: true,
            cost: ability.costs.discardTokenFromSelf(Tokens.blood),
            message:
                '{player} discards 1 blood token from {source} to reduce the cost of the next event they play this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextPlayedCardCost(
                    2,
                    (card) => card.getType() === 'event'
                )
            }))
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to place 1 blood token on {source}, and search the top 10 cards of their deck for an event',
            gameAction: GameActions.simultaneously([
                GameActions.placeToken((context) => ({
                    card: context.source,
                    token: Tokens.blood
                })),
                GameActions.search({
                    title: 'Select an event',
                    topCards: 10,
                    match: { type: 'event' },
                    message: '{player} {gameAction}',
                    gameAction: GameActions.addToHand((context) => ({
                        card: context.searchTarget
                    }))
                })
            ])
        });
    }
}

SeaOfBlood.code = '17149';

export default SeaOfBlood;
