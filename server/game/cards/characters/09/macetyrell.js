const DrawCard = require('../../../drawcard.js');

class MaceTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.isFaction('tyrell') && event.card.getType() === 'character' &&
                                           event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.payGold(1),
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} pays 1 gold to gain 1 power on {1}', this.controller, this);
            }
        });

        this.action({
            title: 'Remove character from game',
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.controller === this.controller &&
                                       card !== this && card.isFaction('tyrell') && card.getType() === 'character'
            },
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        onPhaseStarted: () => true
                    },
                    match: context.target,
                    effect: ability.effects.removeFromGame()
                }));
                this.game.addMessage('{0} uses {1} and kneels their faction card to remove {2} from the game',
                                      this.controller, this, context.target);
            }
        });
    }
}

MaceTyrell.code = '09001';

module.exports = MaceTyrell;
