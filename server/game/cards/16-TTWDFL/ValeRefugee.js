import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ValeRefugee extends DrawCard {
    // Vale Refugee (16018)
    // Forced Reaction: After dominance is determined, if you did not win, discard Vale Refugee from
    // play unless you pay 2 gold.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onDominanceDetermined: (event, context) => event.winner !== context.player
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.player.gold >= 2,
                thenAction: GameActions.choose({
                    title: 'Pay 2 gold?',
                    choices: {
                        Yes: {
                            message: '{player} is forced to pay 2 gold to keep {source} in play',
                            gameAction: GameActions.returnGoldToTreasury((context) => ({
                                player: context.player,
                                amount: 2
                            }))
                        },
                        No: discardSelf()
                    }
                }),
                elseAction: discardSelf()
            })
        });
    }
}

function discardSelf() {
    return {
        message: '{player} is forced to discard {source}',
        gameAction: GameActions.discardCard((context) => ({ card: context.source }))
    };
}

ValeRefugee.code = '16018';

export default ValeRefugee;
