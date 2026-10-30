import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DesmeraRedwyne extends DrawCard {
    // Desmera Redwyne (09013)
    // Reaction: After a character is removed from a challenge, pay 1 gold to give that character +2
    // STR or -1 STR until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRemovedFromChallenge: (event) => event.reason === 'ability'
            },
            cost: ability.costs.payGold(1),
            choices: {
                'Give +2 STR': {
                    message: {
                        format: '{player} uses {source} and pays 1 gold to give {character} +2 STR until the end of the phase',
                        args: { character: (context) => context.event.card }
                    },
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.card,
                        effect: ability.effects.modifyStrength(2)
                    }))
                },
                'Give -1 STR': {
                    message: {
                        format: '{player} uses {source} and pays 1 gold to give {character} -1 STR until the end of the phase',
                        args: { character: (context) => context.event.card }
                    },
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.card,
                        effect: ability.effects.modifyStrength(-1)
                    }))
                }
            }
        });
    }
}

DesmeraRedwyne.code = '09013';

export default DesmeraRedwyne;
