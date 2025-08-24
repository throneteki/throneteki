import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WanderingDisciple extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Drowned God') &&
                    !card.isUnique() &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play from their dead pile',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        card: context.target
                    })).thenExecute((event) => {
                        this.atEndOfPhase((ability) => ({
                            match: event.card,
                            condition: () =>
                                ['play area', 'duplicate'].includes(event.card.location),
                            targetLocation: 'any',
                            effect: ability.effects.discardIfStillInPlay(true)
                        }));
                    }),
                    context
                );
            }
        });
    }
}

WanderingDisciple.code = '26043';

export default WanderingDisciple;
