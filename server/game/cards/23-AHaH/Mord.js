const DrawCard = require('../../drawcard');

class Mord extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to blank character',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: { location: 'play area', type: 'character', condition: (card, context) => card.controller.getTotalInitiative() >= context.player.getTotalInitiative() }
            },
            message: '{player} kneels {source} to treat the text box of {target} as blank until {source} stands or leaves play',
            handler: context => {
                this.lastingEffect(ability => ({
                    until: {
                        onCardStood: event => event.card === this,
                        onCardLeftPlay: event => event.card === this || event.card === context.target
                    },
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }
}

Mord.code = '23025';

module.exports = Mord;
