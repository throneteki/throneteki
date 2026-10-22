import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldForestHunter extends DrawCard {
    // Old Forest Hunter (01131)
    // No attachments except Weapon.
    // Action: Discard 1 card from your hand to gain 1 gold. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card to gain 1 gold',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(1),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

OldForestHunter.code = '01131';

export default OldForestHunter;
