import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PaidOff extends DrawCard {
    // Paid Off (02071)
    // Opponent's character only. Ambush (1).
    // Reaction: After you win an [intrigue] challenge, kneel attached character. Then, that
    // character's controller may give you 1 gold from his or her gold pool to stand that character.
    setupCardAbilities() {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    !context.source.parent.kneeled &&
                    event.challenge.winner === context.player
            },
            message: {
                format: '{player} uses {source} to kneel {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.source.parent })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) => {
                        const player = context.source.parent.controller;
                        return player.getSpendableGold({ activePlayer: player }) >= 1;
                    },
                    thenAction: GameActions.choose({
                        player: (context) => context.source.parent.controller,
                        title: (context) => `Pay 1 gold to stand ${context.source.parent.name}`,
                        choices: {
                            Yes: {
                                message: {
                                    format: '{choosingPlayer} pays 1 gold for {source} to stand {parent}',
                                    args: { parent: (context) => context.source.parent }
                                },
                                gameAction: GameActions.simultaneously([
                                    GameActions.transferGold((context) => ({
                                        from: context.source.parent.controller,
                                        to: context.player,
                                        amount: 1
                                    })),
                                    GameActions.standCard((context) => ({
                                        card: context.source.parent
                                    }))
                                ])
                            },
                            No: remainsKneeled('{choosingPlayer}')
                        }
                    }),
                    elseAction: remainsKneeled('{controller}')
                })
            })
        });
    }
}

function remainsKneeled(payer) {
    return {
        message: {
            format: payer + ' does not pay 1 gold for {source} so {parent} remains kneeled',
            args: {
                controller: (context) => context.source.parent.controller,
                parent: (context) => context.source.parent
            }
        },
        gameAction: GameActions.genericHandler(() => true)
    };
}

PaidOff.code = '02071';

export default PaidOff;
