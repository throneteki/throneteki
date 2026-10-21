import DrawCard from '../../drawcard.js';

class DornishParamour extends DrawCard {
    // Dornish Paramour (01111)
    // Reaction: After Dornish Paramour is declared as an attacker, choose a character controlled by
    // the defending player. That character must be declared as a defender for this challenge, if
    // able.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.defendingPlayer
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));

                this.game.addMessage(
                    '{0} uses {1} to force {2} to be declared as a defender this challenge, if able',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

DornishParamour.code = '01111';

export default DornishParamour;
