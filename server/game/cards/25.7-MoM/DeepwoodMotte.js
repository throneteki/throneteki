const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class DeepwoodMotte extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.hasTrait('Winter')
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: { type: 'location', location: 'play area', limited: false }
            },
            message: '{player} kneels {costs.kneel} to kneel {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard(context => ({ card: context.target, source: this })), context);
            }
        });
    }
}

DeepwoodMotte.code = '25507';
DeepwoodMotte.version = '1.1';

module.exports = DeepwoodMotte;
