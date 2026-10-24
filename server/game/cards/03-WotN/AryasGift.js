import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AryasGift extends DrawCard {
    // Arya's Gift (03024)
    // Action: Move an attachment from a [stark] character you control to another eligible character
    // you control.
    setupCardAbilities() {
        this.action({
            title: 'Move attachment',
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.isFaction('stark') &&
                    card.parent.getType() === 'character' &&
                    card.parent.controller === context.player
            },
            message: '{player} plays {source} to move {target}',
            gameAction: GameActions.chooseCards({
                title: 'Select a character',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player,
                gameAction: (card, context) =>
                    GameActions.attach({
                        player: context.target.controller,
                        attachment: context.target,
                        target: card
                    })
            })
        });
    }
}

AryasGift.code = '03024';

export default AryasGift;
