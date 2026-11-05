import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sparrows extends DrawCard {
    // Sparrows (13097)
    // Shadow (2).
    // Reaction: After Sparrows comes out of shadows, move 1 power from an opponent's faction card
    // to another The Seven card you control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            targets: {
                faction: {
                    activePromptTitle: 'Select a faction card',
                    cardType: ['faction'],
                    cardCondition: (card, context) =>
                        card.getType() === 'faction' &&
                        card.controller !== context.player &&
                        card.power > 0
                },
                card: {
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card !== context.source &&
                        card.hasTrait('The Seven') &&
                        card.controller === context.player
                }
            },
            message: {
                format: '{player} uses {source} to move 1 power from {faction} to {card}',
                args: {
                    faction: (context) => context.targets.faction,
                    card: (context) => context.targets.card
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.targets.faction,
                to: context.targets.card,
                amount: 1
            }))
        });
    }
}

Sparrows.code = '13097';

export default Sparrows;
