const DrawCard = require('../../drawcard.js');

class TheDrownedGodWakes extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner && event.difference >= 10
            },
            message: '{player} plays {source} to have each player choose a character they control, and kill the others',
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.choosingPlayer
            },
            handler: context => {
                const targets = context.targets.getTargets();
                let characters = this.game.filterCardsInPlay(card => !targets.includes(card) && card.getType() === 'character');
                this.game.killCharacters(characters);
            }
        });
    }
}

TheDrownedGodWakes.code = '25044';

module.exports = TheDrownedGodWakes;
