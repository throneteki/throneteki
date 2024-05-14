const DrawCard = require('../../drawcard');

class InDaznaksPit extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to stand each character and start a new challenges phase',
                    context.player,
                    this
                );

                let characters = this.game.filterCardsInPlay(
                    (card) => card.getType() === 'character' && card.kneeled
                );
                for (let character of characters) {
                    character.controller.standCard(character);
                }

                this.game.addPhase('challenge');
            },
            max: ability.limit.perRound(1)
        });
    }
}

InDaznaksPit.code = '11094';

module.exports = InDaznaksPit;
