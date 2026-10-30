import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MargaeryTyrell extends DrawCard {
    // Margaery Tyrell (01181)
    // Challenges Action: Kneel Margaery Tyrell to choose a character. Until the end of the phase,
    // that character gets +3 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +3 STR',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} kneels {source} to give {target} +3 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(3)
            }))
        });
    }
}

MargaeryTyrell.code = '01181';

export default MargaeryTyrell;
