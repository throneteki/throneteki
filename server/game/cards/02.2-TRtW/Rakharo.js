import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function hasAnotherBloodrider(source) {
    return source.controller.anyCardsInPlay(
        (card) => card !== source && card.getType() === 'character' && card.hasTrait('Bloodrider')
    );
}

class Rakharo extends DrawCard {
    // Rakharo (02033)
    // While you control another Bloodrider character, Rakharo gains intimidate.
    // Reaction: After a character is killed to satisfy claim during a challenge you initiated,
    // Rakharo gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => hasAnotherBloodrider(context.source),
            match: this,
            effect: ability.effects.addKeyword('intimidate')
        });

        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    context.game.isDuringChallenge({
                        attackingPlayer: context.source.controller
                    }) &&
                    event.isClaim &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

Rakharo.code = '02033';

export default Rakharo;
