const DrawCard = require('../../drawcard.js');

class RedCloaks extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            limit: ability.limit.perPhase(1),
            condition: () => this.controller.gold > 0,
            handler: () => {
                this.modifyToken('gold', 1);
                this.game.addGold(this.controller, -1);

                this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.controller, this);
            }
        });
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'intrigue',
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['gold'])
        });
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
