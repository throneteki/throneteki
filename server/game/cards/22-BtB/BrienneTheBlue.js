import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BrienneTheBlue extends DrawCard {
    // Brienne the Blue (22024)
    // Action: Choose a character that is attacking or defending alone. Until the end of the
    // challenge, that character gets +5 STR. (+10 STR instead if it is a Rainbow Guard character or
    // Brienne of Tarth.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Select a character',
            target: {
                cardCondition: (card, context) =>
                    context.game.isDuringChallenge({ attackingAlone: card }) ||
                    context.game.isDuringChallenge({ defendingAlone: card })
            },
            message: {
                format: '{player} plays {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: {
                    strBoost: (context) =>
                        context.target.name === 'Brienne of Tarth' ||
                        context.target.hasTrait('Rainbow Guard')
                            ? 10
                            : 5
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(
                    context.target.name === 'Brienne of Tarth' ||
                        context.target.hasTrait('Rainbow Guard')
                        ? 10
                        : 5
                )
            }))
        });
    }
}

BrienneTheBlue.code = '22024';

export default BrienneTheBlue;
