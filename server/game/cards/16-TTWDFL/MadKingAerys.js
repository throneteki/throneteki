const DrawCard = require('../../drawcard');

class MadKingAerys extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.opponentControlsKingslayer(),
            match: this,
            effect: ability.effects.cannotBeKilled()
        });

        this.action({
            title: 'Kill character',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.isMatch({ location: 'play area', trait: ['Lord', 'Lady'] }),
                gameAction: 'kill'
            },
            message: '{player} kneels {source} to kill {target}',
            handler: (context) => {
                this.game.killCharacter(context.target);
            },
            limit: ability.limit.perRound(1)
        });
    }

    opponentControlsKingslayer() {
        return this.game.anyCardsInPlay(
            (card) =>
                card.controller !== this.controller &&
                (card.hasTrait('Lord') ||
                    card.hasTrait('Lady') ||
                    card.name === 'Ser Jaime Lannister')
        );
    }
}

MadKingAerys.code = '16013';

module.exports = MadKingAerys;
