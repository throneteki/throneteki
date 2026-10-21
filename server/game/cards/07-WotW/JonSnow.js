import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    // Jon Snow (07001)
    // Stealth.
    // Reaction: After you win a challenge in which Jon Snow is participating, either: stand each
    // attacking Wildling character, or stand each defending [thenightswatch] character. (Limit once
    // per phase.)
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
