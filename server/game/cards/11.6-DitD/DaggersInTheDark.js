import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaggersInTheDark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.defendingPlayer === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.isAttacking(),
                gameAction: 'kill'
            },
            handler: (context) => {
                let loser = context.event.challenge.loser;
                let target = context.target;

                if (!this.playerHas2Characters(loser)) {
                    this.resolveKill(target);
                    return;
                }

                this.game.promptForSelect(loser, {
                    mode: 'exactly',
                    numCards: 2,
                    activePromptTitle: 'Sacrifice 2 characters to cancel "Daggers in the Dark"?',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.controller === loser &&
                        card.getType() === 'character',
                    onSelect: (player, cards) => this.onCardsSelected(player, cards, target),
                    onCancel: () => this.resolveKill(target)
                });
            }
        });
    }

    playerHas2Characters(player) {
        return player.getNumberOfCardsInPlay((card) => card.getType() === 'character') >= 2;
    }

    resolveKill(target) {
        this.game.killCharacter(target);
        this.game.addMessage('{0} plays {1} to kill {2}', this.controller, this, target);
        return true;
    }

    onCardsSelected(player, cards, target) {
        this.game.resolveGameAction(
            GameActions.simultaneously(cards.map((card) => GameActions.sacrificeCard({ card })))
        );

        this.game.addMessage(
            '{0} plays {1} to kill {2}, but the effect is cancelled by {3} sacrificing {4}',
            this.controller,
            this,
            target,
            player,
            cards
        );

        return true;
    }
}

DaggersInTheDark.code = '11106';

export default DaggersInTheDark;
