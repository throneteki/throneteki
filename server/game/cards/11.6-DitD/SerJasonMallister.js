import DrawCard from '../../drawcard.js';

class SerJasonMallister extends DrawCard {
    // Ser Jason Mallister (11101)
    // While there are no cards in shadows, Ser Jason Mallister gains renown.
    // Reaction: After you win a challenge in which Ser Jason Mallister is attacking, choose a card
    // in shadows controlled by the losing opponent, and discard it.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.getPlayers().every((player) => player.shadows.length === 0),

            match: this,
            effect: [ability.effects.addKeyword('Renown')]
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'shadows' &&
                    card.controller === this.game.currentChallenge.defendingPlayer
            },

            handler: (context) => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to discard a card in shadows controlled by {2}',
                    context.player,
                    this,
                    this.game.currentChallenge.loser
                );
            }
        });
    }
}

SerJasonMallister.code = '11101';

export default SerJasonMallister;
