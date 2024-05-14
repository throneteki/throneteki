const DrawCard = require('../../drawcard.js');

class RecruiterForTheWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.action({
            title: 'Take control of character',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select character with printed cost 2 or less',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.getPrintedCost() <= 2
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to take control of {2}',
                    this.controller,
                    this,
                    context.target
                );
                this.lastingEffect((ability) => ({
                    until: {
                        onCardStood: (event) => event.card === this,
                        onCardLeftPlay: (event) =>
                            event.card === this || event.card === context.target
                    },
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

RecruiterForTheWatch.code = '06045';

module.exports = RecruiterForTheWatch;
