const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class IronEmmett extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getPlayers().every(player => player.shadows.length === 0),
            match: card => card.isMatch({ trait: ['Army', 'Knight'] }),
            effect: [
                ability.effects.removeKeyword('assault'),
                ability.effects.removeKeyword('intimidate'),
                ability.effects.removeKeyword('renown')
            ]
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isDefending()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => card.location === 'shadows' && card.controller === this.game.currentChallenge.defendingPlayer
            },
            message: '{player} uses {source} to choose and discard a card in shadows',
            handler: context => {
                this.game.resolveGameAction(GameActions.discardCard(context => ({ card: context.target })), context);
            }
        });
    }
}

IronEmmett.code = '24013';

module.exports = IronEmmett;
