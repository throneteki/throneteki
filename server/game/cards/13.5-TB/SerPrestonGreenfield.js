const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SerPrestonGreenfield extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    this.opponentCanMovePower(event.challenge.loser)
            },
            message: {
                format: '{player} uses {source} to force {loser} to move power',
                args: { loser: (context) => context.event.challenge.loser }
            },
            handler: (context) => {
                const loser = context.event.challenge.loser;
                this.game.promptForSelect(loser, {
                    cardCondition: (card) =>
                        card.controller === loser &&
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        !card.kneeled,
                    onSelect: (opponent, card) => this.handleSelect(opponent, card),
                    onCancel: (opponent) => this.handleCancel(opponent),
                    source: this
                });
            }
        });
    }

    opponentCanMovePower(opponent) {
        return (
            opponent.faction.power > 0 &&
            opponent.anyCardsInPlay((card) => card.getType() === 'character' && !card.kneeled)
        );
    }

    handleSelect(opponent, card) {
        this.game.addMessage('{0} moves 1 power to {1} for {2}', opponent, card, this);
        this.game.resolveGameAction(
            GameActions.movePower({
                from: opponent.faction,
                to: card
            })
        );
        return true;
    }

    handleCancel(opponent) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', opponent, this);
        return true;
    }
}

SerPrestonGreenfield.code = '13087';

module.exports = SerPrestonGreenfield;
