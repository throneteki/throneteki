const DrawCard = require('../../drawcard.js');

class LordRenlysRide extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +STR and intimidate',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                let topDeadCharacter = this.controller.deadPile.slice(-1)[0];
                let strBoost = 0;

                if (topDeadCharacter) {
                    strBoost = topDeadCharacter.getPrintedStrength();
                }

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(strBoost),
                        ability.effects.addKeyword('Intimidate')
                    ]
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} +{3} STR and intimidate until the end of the phase',
                    this.controller,
                    this,
                    context.target,
                    strBoost
                );
            }
        });
    }
}

LordRenlysRide.code = '06024';

module.exports = LordRenlysRide;
