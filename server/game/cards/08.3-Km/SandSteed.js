import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SandSteed extends DrawCard {
    // Sand Steed (08056)
    // Limit 1 copy per character.
    // Reaction: After a Summer plot card enters your used pile, attached character gains 1 power.
    setupCardAbilities() {
        this.attachmentRestriction(
            (card, context) =>
                card.getType() === 'character' &&
                card.attachments.every(
                    (attachment) =>
                        attachment === context.source || attachment.name !== 'Sand Steed'
                )
        );
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.hasTrait('Summer') &&
                    event.location === 'revealed plots' &&
                    event.player === context.player
            },
            message: {
                format: '{player} uses {source} to gain power on {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

SandSteed.code = '08056';

export default SandSteed;
