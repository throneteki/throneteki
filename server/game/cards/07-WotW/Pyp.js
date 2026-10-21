import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Pyp extends DrawCard {
    // Pyp (07011)
    // No attachments except Weapon.
    // Reaction: After you win a challenge in which Pyp is attacking, choose another attacking
    // [thenightswatch] character. That character gains insight until the end of the phase.
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
                    card !== context.source &&
                    card.isAttacking() &&
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character'
            },
            message:
                '{player} uses {source} to have {target} gain insight until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Insight')
            }))
        });
    }
}

Pyp.code = '07011';

export default Pyp;
