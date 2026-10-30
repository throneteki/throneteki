import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function opponentControlsKingslayer(source) {
    return source.game.anyCardsInPlay(
        (card) =>
            card.controller !== source.controller &&
            (card.hasTrait('Lord') || card.hasTrait('Lady') || card.name === 'Ser Jaime Lannister')
    );
}

class MadKingAerys extends DrawCard {
    // Mad King Aerys (16013)
    // Prized 1. Renown.
    // Mad King Aerys cannot be killed unless an opponent controls a Lord or Lady character, or Ser
    // Jaime Lannister.
    // Dominance Action: Kneel Mad King Aerys to choose and kill a Lord or Lady character. (Limit
    // once per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !opponentControlsKingslayer(context.source),
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
            gameAction: GameActions.kill((context) => ({ card: context.target })),
            limit: ability.limit.perRound(1)
        });
    }
}

MadKingAerys.code = '16013';

export default MadKingAerys;
