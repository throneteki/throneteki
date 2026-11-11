import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DornishParamour extends DrawCard {
    // Dornish Paramour (01111)
    // Reaction: After Dornish Paramour is declared as an attacker, choose a character controlled by
    // the defending player. That character must be declared as a defender for this challenge, if
    // able.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source
            },
            target: {
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
                effect: ability.effects.mustBeDeclaredAsDefender()
            }))
        });
    }
}

DornishParamour.code = '01111';

export default DornishParamour;
