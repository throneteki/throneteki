import DrawCard from '../../drawcard.js';

class OldForestHunter extends DrawCard {
    // Old Forest Hunter (01131)
    // No attachments except Weapon.
    // Action: Discard 1 card from your hand to gain 1 gold. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card to gain 1 gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.discardFromHand(),
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to gain 1 gold',
                    this.controller,
                    this,
                    context.costs.discardFromHand
                );
            }
        });
    }
}

OldForestHunter.code = '01131';

export default OldForestHunter;
