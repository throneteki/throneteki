import DrawCard from '../../drawcard.js';

class MaryaSeaworth extends DrawCard {
    // Marya Seaworth (07025)
    // Reaction: After a character is bypassed using stealth, pay 1 gold to kneel it. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: () => true
            },
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                let target = context.event.target;
                target.controller.kneelCard(target);
                this.game.addMessage(
                    '{0} uses {1} and pays 1 gold to kneel {2}',
                    this.controller,
                    this,
                    target
                );
            }
        });
    }
}

MaryaSeaworth.code = '07025';

export default MaryaSeaworth;
