import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Drogon extends DrawCard {
    // Drogon (11093)
    // Ambush (6). No attachments.
    // Reaction: After you win a challenge in which Drogon is attacking, choose a character
    // controlled by the losing opponent. Until the end of the phase, that character gets -4 STR and
    // is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.game.currentChallenge.loser &&
                    card.getType() === 'character'
            },
            message: '{player} uses {source} to give {target} -4 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.killByStrength(-4)
            }))
        });
    }
}

Drogon.code = '11093';

export default Drogon;
