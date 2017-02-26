const DrawCard = require('../../../drawcard.js');

class ChatayasBrothel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to gain gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a character to kneel',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.controller === this.controller &&
                        card.getType() === 'character' &&
                        card.hasIcon('intrigue')),
                    onSelect: (player, card) => {
                        this.controller.kneelCard(card);
                        this.game.addGold(player, 1);
                        this.game.addMessage('{0} uses {1} to kneel {2} to gain 1 gold', player, this, card);

                        return true;
                    }
                });
            }
        });
    }
}

ChatayasBrothel.code = '04090';

module.exports = ChatayasBrothel;
