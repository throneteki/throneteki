import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DonalNoye extends DrawCard {
    // Donal Noye (06105)
    // Bestow (3). No attachments except Weapon.
    // Action: Discard 1 gold from Donal Noye to put a Weapon attachment into play from your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Weapon into play',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.hasTrait('weapon') &&
                    card.getType() === 'attachment'
            },
            message: '{player} discards 1 gold from {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

DonalNoye.code = '06105';

export default DonalNoye;
