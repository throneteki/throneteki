import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TrystaneMartell extends DrawCard {
    // Trystane Martell (05029)
    // Reaction: After you lose a challenge in which Trystane Martell is participating, choose a
    // character with lower STR than his. Until the end of the phase, that character cannot be
    // declared as a defender.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    context.source.isParticipating()
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < context.source.getStrength()
            },
            message: '{player} uses {source} to make {target} unable to be declared as a defender',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.cannotBeDeclaredAsDefender()
            }))
        });
    }
}

TrystaneMartell.code = '05029';

export default TrystaneMartell;
