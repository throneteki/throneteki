import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArborJester extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} uses {source} to choose {target} and reveal the top 2 cards of their deck',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealTopCards((context) => ({
                        player: context.player,
                        amount: 2,
                        whileRevealed: GameActions.genericHandler((context) => {
                            const numRevealed = context.revealed.length;
                            if (numRevealed > 0) {
                                this.game.promptForSelect(context.player, {
                                    activePromptTitle: `Select a card`,
                                    numCards: 1,
                                    cardCondition: (card) => context.revealed.includes(card),
                                    onSelect: (player, card) => {
                                        this.placeOnBottom(player, card);
                                        let otherCard = context.revealed.find((c) => c !== card);
                                        let strBoost = otherCard
                                            ? otherCard.translateXValue(otherCard.getPrintedCost())
                                            : 0;
                                        this.buffChar(context, strBoost);
                                        return true;
                                    },
                                    onCancel: (player) => {
                                        this.game.addAlert(
                                            'danger',
                                            '{0} does not select any cards for {1}',
                                            player,
                                            this
                                        );
                                        return true;
                                    },
                                    source: this
                                });
                            } else {
                                this.buffChar(context, 0);
                            }
                        })
                    })),
                    context
                );
            }
        });
    }

    placeOnBottom(player, card) {
        this.game.addMessage('{0} places {1} on the bottom of their deck', player, card);
        this.controller.moveCard(card, 'draw deck', {
            bottom: true
        });
    }

    buffChar(context, strBoost) {
        this.untilEndOfPhase((ability) => ({
            match: context.target,
            effect: ability.effects.modifyStrength(strBoost)
        }));

        this.game.addMessage(
            '{0} uses {1} to give {2} +{3} STR',
            this.controller,
            this,
            context.target,
            strBoost
        );
    }
}

ArborJester.code = '00288';

export default ArborJester;
