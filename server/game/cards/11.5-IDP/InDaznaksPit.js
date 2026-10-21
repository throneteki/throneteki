import DrawCard from '../../drawcard.js';

class InDaznaksPit extends DrawCard {
    // In Daznak's Pit (11094)
    // Shadow (3).
    // Interrupt: When the challenges phase ends, stand each character. Following this phase, there
    // is an additional challenges phase. (Max 1 per round.)
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

export default InDaznaksPit;
