import ChallengeTypes from '../../ChallengeTypes.js';
import Claim from '../../Claim.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AToastToTheKing extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    this.controller.anyCardsInPlay({
                        type: 'character',
                        faction: 'martell',
                        trait: ['Lord', 'Lady']
                    })
            },
            max: ability.limit.perPhase(1),
            chooseOpponent: (opponent) => this.getClaimableChallengeTypes(opponent).length > 0,
            handler: (context) => {
                this.chosenOpponent = context.opponent;
                // TODO: Add "chooseChallengeIcon" as a pre-handler choice, as this should be known prior to cancel windows
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons((type) => ({
                            method: 'satisfyClaim',
                            disabled: () =>
                                !this.getClaimableChallengeTypes(this.chosenOpponent).includes(type)
                        }))
                    },
                    source: this
                });
            }
        });
    }

    getClaimableChallengeTypes(opponent) {
        return ChallengeTypes.all
            .map(({ value }) => value)
            .filter(
                (icon) =>
                    !opponent.anyCardsInPlay(
                        (card) => card.getType() === 'character' && card.hasIcon(icon)
                    )
            );
    }

    satisfyClaim(player, claimType) {
        let claim = new Claim();
        claim.addRecipient(this.chosenOpponent);
        claim.challengeType = claimType;
        claim.value = player.getClaim();
        claim.winner = player;

        this.game.addMessage(
            '{0} plays {1} to have {2} satisfy {3} claim',
            player,
            this,
            this.chosenOpponent,
            claimType
        );

        this.game.resolveGameAction(
            GameActions.applyClaim({
                player,
                claim,
                game: this.game
            })
        );

        return true;
    }
}

AToastToTheKing.code = '26028';

export default AToastToTheKing;
