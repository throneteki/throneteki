const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheDefianceOfDuskendale extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: card => card.getType() === 'location' && !card.hasTrait('Stronghold') && card.controller === this.game.currentChallenge.defendingPlayer,
            targetController: 'any',
            effect: ability.effects.addTrait('Contested')
        });

        this.forcedReaction({
            when: {
                onCardKneeled: event => event.card.getType() === 'location'
                    && !event.card.isLimited()
                    && event.card.hasTrait('Contested')
                    && event.source && (event.source.getType() === 'character' || event.cause === 'assault')
            },
            message: {
                format: '{player} is forced to discard {discard} from play for {source}',
                args: { discard: context => context.event.card }
            },
            gameAction: GameActions.discardCard(context => ({ card: context.event.card }))
        });
    }
}

TheDefianceOfDuskendale.code = '23038';

module.exports = TheDefianceOfDuskendale;
