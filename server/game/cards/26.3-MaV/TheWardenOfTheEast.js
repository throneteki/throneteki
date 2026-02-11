import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWardenOfTheEast extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'House Arryn' });
        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.modifyStrength(2)]
        });
        this.reaction({
            when: {
                onCardRevealed: {
                    aggregateBy: (event) => ({
                        controller: event.card.controller,
                        isCharacter: event.card.getType() === 'character',
                        isValidLocation: ['hand', 'draw deck', 'shadows'].includes(
                            event.card.location
                        )
                    }),
                    condition: (aggregate) =>
                        aggregate.controller !== this.controller &&
                        aggregate.isCharacter &&
                        aggregate.isValidLocation
                }
            },
            limit: ability.limit.perRound(3),
            message: {
                format: '{player} uses {source} to have {parent} gain 1 power',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.gainPower({ card: this.parent, amount: 1 })
        });
    }
}

TheWardenOfTheEast.code = '26058';

export default TheWardenOfTheEast;
