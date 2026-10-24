import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PoorFellows extends DrawCard {
    // Poor Fellows (11057)
    // No attachments.
    // Reaction: After you win a challenge in which Poor Fellows is attacking, the losing opponent
    // chooses, either: Poor Fellows gains 1 power, or you draw 1 card.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source)
            },
            message: {
                format: '{player} uses {source} to have {loser} choose between drawing 1 card or gaining 1 power',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.choose({
                player: (context) => context.event.challenge.loser,
                title: 'Opponent draws 1 card or Poor Fellows gains 1 power?',
                choices: {
                    'Draws card': {
                        message: '{player} draws 1 card',
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 1
                        }))
                    },
                    'Gains power': {
                        message: '{player} gains 1 power on {source}',
                        gameAction: GameActions.gainPower((context) => ({
                            card: context.source,
                            amount: 1
                        }))
                    }
                }
            })
        });
    }
}

PoorFellows.code = '11057';

export default PoorFellows;
