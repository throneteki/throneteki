import DrawCard from '../../drawcard.js';

class MadKingAerys extends DrawCard {
    // Mad King Aerys (16013)
    // Prized 1. Renown.
    // Mad King Aerys cannot be killed unless an opponent controls a Lord or Lady character, or Ser
    // Jaime Lannister.
    // Dominance Action: Kneel Mad King Aerys to choose and kill a Lord or Lady character. (Limit
    // once per round.)
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

export default MadKingAerys;
