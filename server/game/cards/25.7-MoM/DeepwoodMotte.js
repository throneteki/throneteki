const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class DeepwoodMotte extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: event => event.plot.hasTrait('Winter')
            },
            target: {
                mode: 'upTo',
                numCards: context => context.event.plot.getReserve(),
                activePromptTitle: context => 'Select up to ' + context.event.plot.getReserve() + ' cards',
                cardCondition: card => card.getType() === 'location' && card.location === 'play area' && card.hasPrintedCost() && card.getPrintedCost() <= 1 && !card.kneeled
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to kneel {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context.targets.getTargets().map(card => GameActions.kneelCard({ card, source: this }))),
                    context
                );
            }
        });
    }
}

DeepwoodMotte.code = '25507';
DeepwoodMotte.version = '1.0';

module.exports = DeepwoodMotte;
