const DrawCard = require('../../drawcard');

class Fury extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Intimidate')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, challengeType: 'power' })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => card.location === 'play area' && ['character', 'location'].includes(card.getType()) && card.power > 0
            },
            handler: context => {
                this.game.addMessage('{0} kneels {1} to move 1 power from {2} to their faction card', context.player, this, context.target);
                this.game.movePower(context.target, this.controller.faction, 1);
            }
        });
    }
}

Fury.code = '12026';

module.exports = Fury;
