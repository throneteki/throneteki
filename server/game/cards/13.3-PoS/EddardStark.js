const DrawCard = require('../../drawcard.js');

class EddardStark extends DrawCard {
	setupCardAbilities(ability) {
			this.action({
				condition: () => this.allCharactersHaveStarkAffiliation()
				title: 'Kill a character'
				phase: 'dominance'
				cost: ability.costs.kneelSelf()
				target: {
					cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getPrintedCost() <= 4
					gameAction: 'kill'
				},
				handler: context => {
					this.game.addMessage('{0} kneels {1} to kill {2}', this.controller, this, context.target);

					this.game.killCharacter(context.target);
				}
				limit: ability.limit.perPhase(1)
			});
	}
}

EddardStark.code = '13041';

module.exports = EddardStark;
