import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HarrenTheBlack extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'greyjoy',
            controller: 'current',
            unique: true
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotMarshal(
                (card) => card.getType() === 'location' && this.hasCopyInDiscard(card)
            )
        });
        this.forcedReaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage && event.source.controller === this.controller
            },
            message: '{player} is forced by {source} to discard the top card of each players deck',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayersInFirstPlayerOrder()
                    .map((player) =>
                        GameActions.discardTopCards({ player, amount: 1, source: this })
                    )
            )
        });
    }

    hasCopyInDiscard(card) {
        let discardPile = card.controller.discardPile;
        return discardPile.some(
            (discardedCard) => card !== discardedCard && card.isCopyOf(discardedCard)
        );
    }
}

HarrenTheBlack.code = '25084';

export default HarrenTheBlack;
