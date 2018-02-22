const DrawCard = require('../../drawcard.js');

class TheIronBank extends DrawCard {
	setupCardAbilities(ability) {
		this.reaction({
			when: {
				onIncomeCollected: event => event.player === this.controller
			},
			handler: () => {
				var interest = this.tokens['gold'];
				this.modifyToken('gold', interest);
				this.game.addMessage('{0} uses {1} to place {2} gold from the treasury on {1}', this.controller, this, interest);
			}
		});
	}
}

TheIronBank.code = '08019'; 

module.exports = TheIronBank;
