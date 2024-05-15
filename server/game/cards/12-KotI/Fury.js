import DrawCard from '../../drawcard.js';

class Fury extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Intimidate')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'power' })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    ['character', 'location'].includes(card.getType()) &&
                    card.power > 0
            },
            message: '{player} kneels {source} to move 1 power from {target} to their faction card',
            handler: (context) => {
                this.game.movePower(context.target, this.controller.faction, 1);
            }
        });
    }
}

Fury.code = '12026';

export default Fury;
