import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FightingPit extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card and put a character into play',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' && card.controller === this.controller
            },
            message: '{player} uses {source} to discard a card',
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard((context) => ({
                        card: context.target
                    })).then({
                        activePromptTitle: 'Select a character',
                        target: {
                            cardCondition: (card) =>
                                card.location === 'discard pile' &&
                                card.controller === this.controller &&
                                card.getType() === 'character' &&
                                card.getPrintedCost() <= 3 &&
                                this.controller.canPutIntoPlay(card)
                        },
                        message: 'Then, {player} puts {target} into play from their discard pile',
                        handler: (context) => {
                            this.game.resolveGameAction(
                                GameActions.putIntoPlay((context) => ({
                                    player: context.player,
                                    card: context.target
                                })).thenExecute((event) => {
                                    this.atEndOfPhase((ability) => ({
                                        match: event.card,
                                        condition: () =>
                                            ['play area', 'duplicate'].includes(
                                                event.card.location
                                            ),
                                        targetLocation: 'any',
                                        effect: ability.effects.returnToHandIfStillInPlay(true)
                                    }));
                                }),
                                context
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

FightingPit.code = '00267';

export default FightingPit;
