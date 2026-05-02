import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SandSteed extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction(
            (card) =>
                card.getType() === 'character' &&
                card.attachments.every(
                    (attachment) => attachment === this || attachment.name !== 'Sand Steed'
                )
        );
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.hasTrait('Summer') &&
                    event.location === 'revealed plots' &&
                    event.player === this.controller
            },
            message: {
                format: '{player} uses {source} to gain power on {parent}',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.gainPower(() => ({ card: this.parent, amount: 1 }))
        });
    }
}

SandSteed.code = '08056';

export default SandSteed;
