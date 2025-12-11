import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernPatriarch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(
                (card) =>
                    card.controller !== this.controller &&
                    card.getType() === 'plot' &&
                    card.hasTrait('Omen')
            )
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.source.controller !== this.controller && event.source.getType() == 'event'
            },
            message: {
                format: '{player} uses {source} to {action} {initiatingCard}',
                args: {
                    action: (context) =>
                        this.hasCardsWithPower(context.event.source.controller)
                            ? 'attempt to cancel'
                            : 'cancel',
                    initiatingCard: (context) => context.event.source
                }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => this.hasCardsWithPower(context.event.source.controller),
                thenAction: GameActions.genericHandler((context) => {
                    this.game.promptForSelect(context.event.souce.controller, {
                        source: this,
                        activePromptTitle: 'Select a card to move power from',
                        numCards: 1,
                        cardCondition: (card) =>
                            card.controller === context.event.source.controller && card.power > 0,
                        onSelect: (player, card) => {
                            this.game.addMessage(
                                '{0} moves 1 power from {1} to {2} for {2}',
                                player,
                                card,
                                this
                            );
                            return true;
                        },
                        onCancel: (player) => {
                            this.game.addMessage(
                                '{0} has chosen to allow {1} to cancel {2}',
                                player,
                                this,
                                context.event.source
                            );
                            context.event.cancel();
                            return true;
                        }
                    });
                }),
                elseAction: GameActions.genericHandler((context) => {
                    context.event.cancel();
                })
            }),
            limit: ability.limit.perRound(1)
        });
    }

    hasCardsWithPower(player) {
        return player.getNumberOfCardsInPlay((card) => card.power > 0) > 0;
    }
}

NorthernPatriarch.code = '26091';

export default NorthernPatriarch;
