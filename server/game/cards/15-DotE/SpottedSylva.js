import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpottedSylva extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.isAttacking()
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            handler: (context) => {
                let selections = context.targets.selections.filter(
                    (selection) => !!selection.value
                );
                for (const selection of selections) {
                    this.game.addMessage(
                        '{0} returns {1} to their hand for {2}',
                        selection.choosingPlayer,
                        selection.value,
                        this
                    );
                }
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map((selection) =>
                            GameActions.returnCardToHand({
                                player: selection.choosingPlayer,
                                card: selection.value
                            })
                        )
                    )
                );
            }
        });
    }
}

SpottedSylva.code = '15031';

export default SpottedSylva;
