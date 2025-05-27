import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lannisport extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller &&
                    event.challenge.initiatedChallengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to end the challenge with no winner or loser unless {attackingPlayer} discards 1 card from their hand',
                args: { attackingPlayer: (context) => context.event.challenge.attackingPlayer }
            },
            handler: (context) => {
                const opponent = context.event.challenge.initiatingPlayer;
                if (opponent.hand.length < 1) {
                    this.cancelChallenge();
                    return;
                }

                this.game.promptWithMenu(opponent, this, {
                    activePrompt: {
                        menuTitle: `Discard a card for ${context.source.name}?`,
                        buttons: [
                            { text: 'Yes', method: 'promptToDiscard' },
                            { text: 'No', method: 'cancelChallenge' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    promptToDiscard(opponent) {
        this.game.promptForSelect(opponent, {
            activePrompt: 'Select a card',
            cardCondition: (card) => card.controller === opponent && card.location === 'hand',
            onSelect: (opponent, card) => this.discardSelectedCards(opponent, card),
            onCancel: () => this.cancelChallenge(),
            source: this
        });
        return true;
    }

    discardSelectedCards(opponent, card) {
        this.game.addMessage('{0} discards {1} from their hand', opponent, card);
        this.game.resolveGameAction(GameActions.discardCard({ card }));
        return true;
    }

    cancelChallenge() {
        this.game.currentChallenge.cancelChallenge();
        this.game.addMessage(
            '{0} does not discard a card from their hand, cancelling the challenge',
            this.game.currentChallenge.initiatingPlayer
        );
        return true;
    }
}

Lannisport.code = '26006';

export default Lannisport;
