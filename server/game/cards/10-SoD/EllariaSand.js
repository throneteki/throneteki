import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EllariaSand extends DrawCard {
    // Ellaria Sand (10002)
    // Reaction: After Ellaria Sand is declared as an attacker, choose up to 3 characters controlled
    // by the defending player. Each of those characters must be declared as a defender for this
    // challenge, if able.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.game.currentChallenge.defendingPlayer
            },
            message:
                '{player} uses {source} to force {target} to be declared as a defender this challenge, if able',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                targetController: 'any',
                effect: ability.effects.mustBeDeclaredAsDefender()
            }))
        });
    }
}

EllariaSand.code = '10002';

export default EllariaSand;
