const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HarryTheHeir extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Anya Waynwood' && card.controller === this.controller,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                // TODO: Add 'source' to all kneel effects & costs, and add event.source.controller === this.controller to below conditions
                onCardKneeled: event => this.game.currentChallenge
                    && event.card.controller === this.controller 
                    && event.card.isMatch({ type: 'location', faction: 'neutral' })
            },
            message: {
                format: '{player} uses {source} to stand {location}',
                args: { location: context => context.event.card }
            },
            gameAction: GameActions.standCard(context => ({ card: context.event.card }))
                .thenExecute(thenContext => {
                    if(thenContext.card.hasTrait('House Arryn')) {
                        this.game.addMessage('Then, {0} stands {1}', this.controller, this);
                        this.game.resolveGameAction(GameActions.standCard({ card: this }), thenContext);
                    }
                })
        });
    }
}

HarryTheHeir.code = '23022';

module.exports = HarryTheHeir;
