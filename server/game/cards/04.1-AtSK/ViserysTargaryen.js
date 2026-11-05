import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ViserysTargaryen extends DrawCard {
    // Viserys Targaryen (04014)
    // While Viserys Targaryen is attacking, each King character must be declared as a defender, if
    // able.
    // Interrupt: When the dominance phase ends, if no opponent controls a King character, Viserys
    // Targaryen gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            targetController: 'any',
            match: (card) => card.hasTrait('King') && card.getType() === 'character',
            effect: ability.effects.mustBeDeclaredAsDefender()
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'dominance' &&
                    context.source.opponentHasNoKing() &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} uses {source} to gain 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }

    opponentHasNoKing() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.every(
            (opponent) => !opponent.anyCardsInPlay((card) => card.hasTrait('King'))
        );
    }
}

ViserysTargaryen.code = '04014';

export default ViserysTargaryen;
