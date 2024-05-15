import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                let affectedCharacters = [];
                if (this.game.currentChallenge.attackingPlayer === this.controller) {
                    affectedCharacters = this.controller.filterCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('Wildling') &&
                            card.getType() === 'character'
                    );
                } else {
                    affectedCharacters = this.controller.filterCardsInPlay(
                        (card) =>
                            card.isDefending() &&
                            card.isFaction('thenightswatch') &&
                            card.getType() === 'character'
                    );
                }

                for (let card of affectedCharacters) {
                    card.controller.standCard(card);
                }

                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    affectedCharacters
                );
            }
        });
    }
}

JonSnow.code = '07001';

export default JonSnow;
