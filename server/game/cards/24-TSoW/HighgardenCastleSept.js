const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HighgardenCastleSept extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.allCards.filter(card => card.location === 'shadows').length === 0,
            match: card => card.isMatch({ controller: this.controller, trait: ['Lord', 'Lady'] }),
            effect: ability.effects.addTrait('The Seven')
        });
        this.reaction({
            when: {
                onCardPowerGained: event => event.getType() === 'character',
                onCardPowerMoved: event => event.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                choosingPlayer: 'each',
                cardCondition: { controller: 'choosingPlayer', location: 'shadows' },
                ifAble: true
            },
            message: '{player} kneels {costs.kneel} to have each player choose a card they control in shadows, if able, and place it on top of their deck',
            handler: context => {
                this.game.resolveGameAction(GameActions.simultaneously(context => 
                    context.targets.getTargets().map(target => GameActions.returnCardToDeck({ card: target }))
                ), context);
            }
        });
    }
}

HighgardenCastleSept.code = '24024';

module.exports = HighgardenCastleSept;
