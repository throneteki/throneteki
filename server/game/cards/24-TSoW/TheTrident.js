import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheTrident extends DrawCard {
    // The Trident (24028)
    // Forced Reaction: After you win a challenge as the attacking player, give control of The
    // Trident to the losing opponent unless you sacrifice another neutral location. (Cannot be
    // canceled.)
    // +1 Claim
    setupCardAbilities() {
        this.plotModifiers({
            claim: 1
        });
        this.forcedReaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player
            },
            message: {
                format: '{player} is forced to give control of {source} to {loser}, or sacrifice another neutral location',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.choose({
                choices: {
                    'Give Control': {
                        message: {
                            format: '{player} gives control of {source} to {loser}',
                            args: { loser: (context) => context.event.challenge.loser }
                        },
                        gameAction: GameActions.takeControl((context) => ({
                            card: context.source,
                            player: context.event.challenge.loser,
                            context
                        }))
                    },
                    'Sacrifice Location': {
                        message: '{player} chooses to sacrifice another neutral location',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a location',
                            cardCondition: (card, context) =>
                                card.getType() === 'location' &&
                                card.location === 'play area' &&
                                card.isFaction('neutral') &&
                                card !== context.source &&
                                card.controller === context.player,
                            gameAction: (card) => GameActions.sacrificeCard({ card })
                        })
                    }
                }
            })
        });
    }
}

TheTrident.code = '24028';

export default TheTrident;
