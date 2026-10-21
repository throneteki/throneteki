import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Reek extends DrawCard {
    setupCardAbilities() {
        this.stateCheck({
            condition: (context) =>
                context.player.anyCardsInPlay({ type: 'character', name: 'Theon Greyjoy' }),
            message: '{player} sacrifices {source} as they control Theon Greyjoy',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isUnopposed() &&
                    this.controller.anyCardsInPlay({
                        type: 'character',
                        trait: 'House Bolton',
                        attacking: true
                    })
            },
            message: {
                format: '{player} uses {source} to give control of {source} to {loser}',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.takeControl((context) => ({
                player: context.event.challenge.loser,
                card: context.source
            })).then({
                target: {
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.controller === context.parentContext.event.challenge.loser &&
                        !card.isLoyal() &&
                        context.player.canControl(card),
                    gameAction: 'takeControl'
                },
                message: 'Then, {player} takes control of {target}',
                gameAction: GameActions.takeControl((context) => ({
                    player: context.player,
                    card: context.target
                }))
            })
        });
    }
}

Reek.code = '20027';

export default Reek;
