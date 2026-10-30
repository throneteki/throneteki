import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Plundered extends DrawCard {
    // Plundered (10028)
    // Opponent's location only. Terminal.
    // Reaction: After attached location's controller loses a challenge as the defending player,
    // kneel attached location. Then, you may sacrifice Plundered to gain 3 gold.
    setupCardAbilities() {
        this.attachmentRestriction({ type: 'location', controller: 'opponent' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    !!context.source.parent &&
                    event.challenge.loser === context.source.parent.controller &&
                    event.challenge.defendingPlayer === context.source.parent.controller
            },
            message: {
                format: '{player} uses {source} to kneel {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.source.parent })).then({
                gameAction: GameActions.may({
                    title: (context) => `Sacrifice ${context.source.name} to gain 3 gold?`,
                    message: '{player} then sacrifices {source} to gain 3 gold',
                    gameAction: GameActions.simultaneously([
                        GameActions.sacrificeCard((context) => ({ card: context.source })),
                        GameActions.gainGold((context) => ({ player: context.player, amount: 3 }))
                    ])
                })
            })
        });
    }
}

Plundered.code = '10028';

export default Plundered;
