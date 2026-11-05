import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EliaSand extends DrawCard {
    // Elia Sand (04075)
    // Reaction: After you lose a challenge, choose a character. Until the end of the phase, that
    // character gains stealth. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to give {target} stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Stealth')
            }))
        });
    }
}

EliaSand.code = '04075';

export default EliaSand;
