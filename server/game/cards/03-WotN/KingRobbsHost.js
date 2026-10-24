import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function powerToMove(context) {
    return context.game.anyPlotHasTrait('War') ? 2 : 1;
}

class KingRobbsHost extends DrawCard {
    // King Robb's Host (03001)
    // No attachments.
    // Reaction: After you win a [military] challenge in which King Robb's Host is participating,
    // move 1 power from the losing opponent's faction card to an attacking character. (2 power
    // instead if there is a War plot card revealed.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.player &&
                    context.source.isParticipating() &&
                    event.challenge.loser.faction.power >= 1
            },
            target: {
                activePromptTitle: 'Select an attacking character',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            message: {
                format: "{player} uses {source} to move {amount} power from {loser}'s faction card to {target}",
                args: {
                    amount: (context) => powerToMove(context),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.loser.faction,
                to: context.target,
                amount: powerToMove(context)
            }))
        });
    }
}

KingRobbsHost.code = '03001';

export default KingRobbsHost;
