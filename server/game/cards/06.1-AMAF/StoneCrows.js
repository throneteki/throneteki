import DrawCard from '../../drawcard.js';

class StoneCrows extends DrawCard {
    // Stone Crows (06009)
    // Ambush (3). Bestow (2).
    // Reaction: After you win a challenge in which Stone Crows is attacking, discard 1 gold from it
    // to have the losing opponent choose and kill a defending character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    event.challenge.defenders.length >= 1
            },
            cost: ability.costs.discardGold(),
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                this.game.promptForSelect(otherPlayer, {
                    cardCondition: (card) => card.isDefending() && card.getType() === 'character',
                    activePromptTitle: 'Select character to kill',
                    source: this,
                    gameAction: 'kill',
                    onSelect: (player, card) => {
                        card.controller.killCharacter(card);
                        this.game.addMessage(
                            '{0} discards 1 gold from {1} to force {2} to kill {3}',
                            this.controller,
                            this,
                            otherPlayer,
                            card
                        );

                        return true;
                    }
                });
            }
        });
    }
}

StoneCrows.code = '06009';

export default StoneCrows;
