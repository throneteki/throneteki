import DrawCard from '../../drawcard.js';

class CorpseLake extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.originalLocation === 'draw deck' &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller &&
                    this.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }
}

CorpseLake.code = '09028';

export default CorpseLake;
