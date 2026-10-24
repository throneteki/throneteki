import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrazenBeast extends DrawCard {
    // Brazen Beast (11113)
    // No attachments. Shadow (3).
    // Marshaling Action: Pay 3 gold to put Brazen Beast into shadows from your discard pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into shadows',
            // Explicitly make this activated by click instead of menu so that
            // it isn't necessary to introduce menus while a card is out-of-play
            clickToActivate: true,
            location: 'discard pile',
            phase: 'marshal',
            cost: ability.costs.payGold(3),
            message: '{player} pays 3 gold to put {source} into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
        });
    }
}

BrazenBeast.code = '11113';

export default BrazenBeast;
