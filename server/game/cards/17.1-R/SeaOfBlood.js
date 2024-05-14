const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class SeaOfBlood extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next event by 2',
            cost: ability.costs.discardTokenFromSelf(Tokens.blood),
            message:
                '{player} discards 1 blood token from {source} to reduce the cost of the next event they play this phase by 2',
            handler: () => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextPlayedCardCost(
                        2,
                        (card) => card.getType() === 'event'
                    )
                }));
            }
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to place 1 blood token on {source}, and search the top 10 cards of their deck for an event',
            gameAction: GameActions.simultaneously([
                GameActions.placeToken(() => ({
                    card: this,
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

module.exports = SeaOfBlood;
