const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class FightToTheLast extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    (event.allowSave || event.isBurn) &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller
            },
            location: 'hand',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.event.card,
                    effect: ability.effects.setStrength(1)
                }));
                context.event.saveCard();
                let savedCard = context.event.card;
                if (context.event.card.kneeled && context.event.card.allowGameAction('stand')) {
                    this.game.resolveGameAction(
                        GameActions.standCard(() => ({ card: savedCard })),
                        context
                    );
                }

                this.game.addMessage(
                    "{0} plays {1} to save, stand and set {2}'s STR to 1 until the end of the phase",
                    this.controller,
                    this,
                    context.event.card
                );

                this.atEndOfPhase((ability) => ({
                    match: context.event.card,
                    condition: () => 'play area' === context.event.card.location,
                    effect: ability.effects.killIfStillInPlay(false)
                }));
            }
        });
    }
}

FightToTheLast.code = '15036';

module.exports = FightToTheLast;
