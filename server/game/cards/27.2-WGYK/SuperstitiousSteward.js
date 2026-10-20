import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SuperstitiousSteward extends DrawCard {
    setupCardAbilities() {
        const revealingPlayer = (context) => context.event.plot.controller;

        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            gameAction: GameActions.nameTrait({
                message: '{player} uses {source} to name the {trait} trait',
                gameAction: GameActions.delayedEffect({
                    duration: 'untilEndOfPhase',
                    when: {
                        onPlotRevealed: (event, context) =>
                            event.plot.controller !== context.player &&
                            event.plot.hasTrait(context.namedTrait)
                    },
                    gameAction: GameActions.may({
                        title: (context) => `Sacrifice ${context.source.name}?`,
                        message: {
                            format: '{player} sacrifices {source} to have {opponent} choose a character they control and discard it from play',
                            args: { opponent: revealingPlayer }
                        },
                        gameAction: GameActions.sacrificeCard((context) => ({
                            card: context.source,
                            player: context.player
                        })).then({
                            target: {
                                choosingPlayer: (player, context) =>
                                    player === revealingPlayer(context.parentContext),
                                cardCondition: (card, context) =>
                                    card.location === 'play area' &&
                                    card.getType() === 'character' &&
                                    card.controller === revealingPlayer(context.parentContext)
                            },
                            message: {
                                format: '{opponent} discards {target} from play',
                                args: {
                                    opponent: (context) => revealingPlayer(context.parentContext)
                                }
                            },
                            gameAction: GameActions.discardCard((context) => ({
                                card: context.target
                            }))
                        })
                    })
                })
            })
        });
    }
}

SuperstitiousSteward.code = '27029';

export default SuperstitiousSteward;
