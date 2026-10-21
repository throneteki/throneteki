import DrawCard from '../../drawcard.js';

class ViserysTargaryen extends DrawCard {
    // Viserys Targaryen (04014)
    // While Viserys Targaryen is attacking, each King character must be declared as a defender, if
    // able.
    // Interrupt: When the dominance phase ends, if no opponent controls a King character, Viserys
    // Targaryen gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) => card.hasTrait('King') && card.getType() === 'character',
            effect: ability.effects.mustBeDeclaredAsDefender()
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'dominance' &&
                    this.opponentHasNoKing() &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} uses {1} to gain 1 power on {1}', this.controller, this);
            }
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
