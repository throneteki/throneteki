const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class FightToTheLast extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: event => event.allowSave && event.card.canBeSaved() && event.card.controller === this.controller
            },
            location: 'hand',
            handler: context => {
                context.event.saveCard();
                if(context.event.card.kneeled && context.event.card.allowGameAction('stand')) {
                    this.game.resolveGameAction(
                        GameActions.standCard(context.event.card),
                        context
                    );
                }
                this.untilEndOfPhase(ability => ({
                    match: context.event.card,
                    effect: ability.effects.setStrength(1)
                }));

                this.game.addMessage('{0} plays {1} to save, stand and set {2}\'s STR to 1 until the end of the phase',
                    this.controller, this, context.event.card);
                
                this.untilEndOfPhase(ability => ({
                    match: context.event.card,
                    effect: ability.effects.killIfStillInPlay(false)
                }));
            }
        });
    }
}

FightToTheLast.code = '15036';

module.exports = FightToTheLast;
