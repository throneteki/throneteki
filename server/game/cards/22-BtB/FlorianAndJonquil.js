import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FlorianAndJonquil extends DrawCard {
    // "Florian and Jonquil" (22028)
    // Action: Choose a unique character with printed cost 3 or lower. Until the end of the phase,
    // that character gains renown. Then, attach "Florian and Jonquil" to that character as an
    // attachment with the text: "Terminal. Attached character gains the Fool and Knight traits."
    setupCardAbilities(ability) {
        this.action({
            title: 'Select a character',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isUnique() &&
                    card.getPrintedCost() <= 3
            },
            message:
                '{player} plays {source} to have {target} gain renown until the end of the phase',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }))
            ]).then({
                message: {
                    format: 'Then {player} attaches {source} to {target}',
                    args: { target: (context) => context.parentContext.target }
                },
                gameAction: GameActions.attach((context) => ({
                    player: context.player,
                    attachment: context.source,
                    target: context.parentContext.target,
                    playingType: 'play',
                    asAttachment: {
                        keywords: ['Terminal'],
                        effect: [
                            ability.effects.addTrait('Fool'),
                            ability.effects.addTrait('Knight')
                        ]
                    }
                }))
            })
        });
    }
}

FlorianAndJonquil.code = '22028';

export default FlorianAndJonquil;
