import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordRenlysRide extends DrawCard {
    // "Lord Renly's Ride" (06024)
    // Action: Choose a character. Until the end of the phase, that character gets +X STR and gains
    // intimidate. X is the printed STR of the top character in your dead pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +STR and intimidate',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: {
                format: '{player} plays {source} to give {target} +{strength} STR and intimidate until the end of the phase',
                args: { strength: (context) => topDeadStrength(context) }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.modifyStrength(topDeadStrength(context)),
                    ability.effects.addKeyword('Intimidate')
                ]
            }))
        });
    }
}

function topDeadStrength(context) {
    const topDeadCharacter = context.player.deadPile.slice(-1)[0];
    return topDeadCharacter ? topDeadCharacter.getPrintedStrength() : 0;
}

LordRenlysRide.code = '06024';

export default LordRenlysRide;
