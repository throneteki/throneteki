import DrawCard from '../../drawcard.js';

class TrystaneMartell extends DrawCard {
    // Trystane Martell (05029)
    // Reaction: After you lose a challenge in which Trystane Martell is participating, choose a
    // character with lower STR than his. Until the end of the phase, that character cannot be
    // declared as a defender.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.loser && this.isParticipating()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < this.getStrength()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to make {2} unable to be declared as a defender',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.cannotBeDeclaredAsDefender()
                }));
            }
        });
    }
}

TrystaneMartell.code = '05029';

export default TrystaneMartell;
