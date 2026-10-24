import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheMightOfTheReach extends DrawCard {
    // The Might of the Reach (11084)
    // Challenges Action: Choose a participating character. Until the end of the challenge, that
    // character gets +10 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +10 STR to participating character',
            phase: 'challenge',
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating()
            },
            message:
                '{player} plays {source} to give +10 STR to {target} until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(10)
            }))
        });
    }
}

TheMightOfTheReach.code = '11084';

export default TheMightOfTheReach;
