import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Reek extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    onCardEntersPlay(event) {
        let card = event.card;
        if (card !== this && card.name !== 'Theon Greyjoy') {
            return;
        }

        let theon = this.controller.cardsInPlay.find((card) => card.name === 'Theon Greyjoy');

        if (!theon) {
            return;
        }

        this.controller.sacrificeCard(this);
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isUnopposed() &&
                    this.hasAttackingBolton()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} gives control of {1} to {2}',
                    context.player,
                    this,
                    context.event.challenge.loser
                );
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        player: context.event.challenge.loser,
                        card: this
                    })).then((context) => ({
                        handler: () => {
                            this.game.promptForSelect(context.player, {
                                cardCondition: (card) =>
                                    card.location === 'play area' &&
                                    card.getType() === 'character' &&
                                    card.controller === context.event.challenge.loser &&
                                    !card.isLoyal() &&
                                    context.player.canControl(card),
                                source: this,
                                onSelect: (player, card) =>
                                    this.onCardSelected(player, card, context)
                            });
                        }
                    })),
                    context
                );
            }
        });
    }

    onCardSelected(player, card, context) {
        this.game.addMessage('{0} then takes control of {1}', context.player, card);
        this.game.resolveGameAction(
            GameActions.takeControl(() => ({
                player: player,
                card: card
            })),
            context
        );

        return true;
    }

    hasAttackingBolton() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                card.hasTrait('House Bolton') &&
                card.getType() === 'character'
        );
    }
}

Reek.code = '20027';

export default Reek;
