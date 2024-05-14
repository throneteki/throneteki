import DrawCard from '../../drawcard.js';

class EllariaSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.defendingPlayer
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    targetController: 'any',
                    effect: ability.effects.mustBeDeclaredAsDefender()
                }));

                this.game.addMessage(
                    '{0} uses {1} to force {2} to be declared as a defender this challenge, if able',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

EllariaSand.code = '10002';

export default EllariaSand;
