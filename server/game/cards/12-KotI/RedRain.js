const DrawCard = require('../../drawcard');

class RedRain extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy', unique: true });

        this.whileAttached({
            match: (card) => card.name === 'The Drumm',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true }) &&
                    this.parent.isAttacking() &&
                    this.parent.canGainPower()
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 2 power',
                    context.player,
                    this,
                    this.parent
                );
                this.parent.modifyPower(2);
            }
        });
    }
}

RedRain.code = '12021';

module.exports = RedRain;
