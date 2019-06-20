const DrawCard = require('../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            phase: 'dominance',
            condition: context => this.allCharactersHaveStarkAffiliation(context.player),
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getPrintedCost() <= 4,
                gameAction: 'kill'
            },
            message: '{player} kneels {source} to kill {target}',
            handler: context => {
                this.game.killCharacter(context.target);
            },
            limit: ability.limit.perPhase(1)
        });
    }

    allCharactersHaveStarkAffiliation(player) {
        let characters = player.filterCardsInPlay(card => card.getType() === 'character');

        return characters.length > 0 && characters.every(card => card.isFaction('stark'));
    }
}

EddardStark.code = '13041';

module.exports = EddardStark;
