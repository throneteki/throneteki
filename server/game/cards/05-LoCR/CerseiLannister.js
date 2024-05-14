const DrawCard = require('../../drawcard.js');

class CerseiLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'intrigue' })
        });
        this.reaction({
            when: {
                'onCardDiscarded:aggregate': (event) =>
                    event.events.some(
                        (discardEvent) =>
                            discardEvent.cardStateWhenDiscarded.controller !== this.controller &&
                            discardEvent.cardStateWhenDiscarded.location === 'hand'
                    ) && this.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addMessage(
                    "{0} gains 1 power on {1} in reaction to a card being discarded from their opponents's hand",
                    this.controller,
                    this
                );
                this.modifyPower(1);
            }
        });
    }
}

CerseiLannister.code = '05001';

module.exports = CerseiLannister;
