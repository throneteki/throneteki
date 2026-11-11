import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GrowingStrong extends DrawCard {
    // Growing Strong (01195)
    // Challenges Action: Choose up to three [tyrell] characters. Until the end of the phase, each
    // of the chosen characters gets +2 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +2 STR to up to 3 characters',
            phase: 'challenge',
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to three characters',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            message: '{player} plays {source} to give +2 STR to {target}',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

GrowingStrong.code = '01195';

export default GrowingStrong;
