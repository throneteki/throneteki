import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BoundForTheWall extends DrawCard {
    // Bound for the Wall (17121)
    // Reaction: After you win a challenge as the attacking player, discard the top 2 cards of the
    // losing opponent's deck. You may put an eligible character of the losing player's choice from
    // their discard pile into play under your control. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.player,
                        attackingPlayer: context.player
                    })
            },
            message: {
                format: "{player} plays {source} to discard the top 2 cards of {loser}'s deck and have {loser} select a character from their discard pile to put into play",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.discardTopCards((context) => ({
                player: context.event.challenge.loser,
                amount: 2
            })).then({
                gameAction: GameActions.chooseCards({
                    player: (context) => context.parentContext.event.challenge.loser,
                    title: 'Select a character',
                    cardCondition: (card, context) =>
                        card.location === 'discard pile' &&
                        card.controller === context.choosingPlayer &&
                        card.getType() === 'character',
                    gameAction: (card, context) =>
                        GameActions.putIntoPlay({ player: context.player, card })
                })
            }),
            max: ability.limit.perChallenge(1)
        });
    }
}

BoundForTheWall.code = '17121';

export default BoundForTheWall;
