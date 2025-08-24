import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Retribution extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card.controller === this.controller &&
                    this.isApplyingClaim('military') &&
                    this.controlsFewerCharacters()
            },
            target: {
                choosingPlayer: (player) => player === this.game.currentChallenge.attackingPlayer,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    GameActions.kill({ card }).allow()
            },
            message: {
                format: '{player} plays {source} to have {controller} choose and kill {target}',
                args: { controller: (context) => context.target.controller }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }

    isApplyingClaim(type) {
        return (
            this.game.currentChallenge &&
            this.game.claim.isApplying &&
            this.game.claim.type === type
        );
    }

    controlsFewerCharacters() {
        return (
            this.controller.getNumberOfCardsInPlay({ type: 'character' }) <
            this.game.currentChallenge.attackingPlayer.getNumberOfCardsInPlay({
                type: 'character'
            })
        );
    }
}

Retribution.code = '26048';

export default Retribution;
