const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheCrag extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.cannotInitiateChallengeType('intrigue')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ challengeType: 'military', winner: this.controller, by5: true })
            },
            message: {
                format: '{player} uses {source} to discard {amount} cards at random from {loser}\'s hand',
                args: { amount: context => this.getAmountForDiscard(context), loser: context => context.event.challenge.loser }
            },
            gameAction: GameActions.discardAtRandom(context => ({ player: context.event.challenge.loser, amount: this.getAmountForDiscard(context) }))
        });
    }

    getAmountForDiscard(context) {
        return context.player.anyCardsInPlay(card => card.name === 'Robb Stark') ? 2 : 1;
    }
}

TheCrag.code = '24018';

module.exports = TheCrag;
