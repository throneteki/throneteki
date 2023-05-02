const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class SerGilbertFarring extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ loyal: true, type: 'location', kneeled: false }),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardKneeled: event => event.card.isFaction('baratheon')
                                        && event.card.getType() === 'location' 
                                        && event.card.controller === this.controller
                                        && ['assault', 'ability'].includes(event.reason)
            },
            cost: ability.costs.standSelf(),
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.standCard(context => ({ card: context.event.card }))
        });
    }
}

SerGilbertFarring.code = '24002';

module.exports = SerGilbertFarring;
