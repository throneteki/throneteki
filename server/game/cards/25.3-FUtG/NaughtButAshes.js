import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NaughtButAshes extends DrawCard {
    // Naught but Ashes (25054)
    // Shadow (1).
    // Challenges Action: Choose a participating character without attachments. Until the end of the
    // phase, that character gets -1 STR for each card in shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character -X STR',
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true,
                    hasAttachments: false
                }
            },
            message: {
                format: '{player} plays {source} to give {target} {amount} STR until the end of the phase',
                args: { amount: (context) => context.source.getAmount() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(context.source.getAmount())
            }))
        });
    }

    getAmount() {
        return this.game.getPlayers().reduce((acc, player) => acc + player.shadows.length, 0) * -1;
    }
}

NaughtButAshes.code = '25054';

export default NaughtButAshes;
