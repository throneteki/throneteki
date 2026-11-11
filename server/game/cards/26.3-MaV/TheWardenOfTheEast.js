import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWardenOfTheEast extends DrawCard {
    // The Warden of the East (26058)
    // House Arryn character only.
    // Attached character gets +2 STR and gains the Commander trait.
    // Reaction: After 1 or more characters are revealed from an opponent's hand, deck, or shadows
    // area, attached character gains 1 power. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'House Arryn' });
        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.modifyStrength(2)]
        });
        this.reaction({
            when: {
                onCardRevealed: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenRevealed.controller,
                        isCharacter: event.cardStateWhenRevealed.getType() === 'character',
                        isValidLocation: ['hand', 'draw deck', 'shadows'].includes(
                            event.cardStateWhenRevealed.location
                        )
                    }),
                    condition: (aggregate, events, context) =>
                        aggregate.controller !== context.source.controller &&
                        aggregate.isCharacter &&
                        aggregate.isValidLocation
                }
            },
            limit: ability.limit.perRound(3),
            message: {
                format: '{player} uses {source} to have {parent} gain 1 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

TheWardenOfTheEast.code = '26058';

export default TheWardenOfTheEast;
