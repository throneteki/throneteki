const DrawCard = require('../../../drawcard.js');

class Plunder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            condition: () => this.getGold() >= 1 && !this.controller.cannotGainGold,
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let gold = this.getGold();
                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} uses {1} and kneels their faction card to gain {2} gold', this.controller, this, gold);
            }
        });
    }

    getGold() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return 0;
        }

        return opponent.allCards.reduce((num, card) => {
            if(card.location === 'discard pile' && (card.getType() === 'location' || card.getType() === 'attachment')) {
                return num + 1;
            }

            return num;
        }, 0);
    }
}

Plunder.code = '06072';

module.exports = Plunder;
