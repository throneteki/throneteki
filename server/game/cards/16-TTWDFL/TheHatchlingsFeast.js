const DrawCard = require('../../drawcard');
const Message = require('../../Message');

class TheHatchlingsFeast extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give -STR',
            target: {
                mode: 'exactly',
                numCards: 3,
                cardCondition: { location: 'play area', type: 'character', hasAttachments: false }
            },
            handler: (context) => {
                this.chooseStrDebuff({
                    amount: 1,
                    choices: [],
                    context,
                    remainingCards: [...context.target]
                });
            }
        });
    }

    chooseStrDebuff({ context, remainingCards, amount, choices }) {
        this.game.promptForSelect(context.player, {
            activePromptTitle: `Select -${amount} STR`,
            cardCondition: (card) => remainingCards.includes(card),
            onSelect: (player, card) => {
                this.handleStrDebuffSelected({ context, remainingCards, amount, choices, card });
                return true;
            },
            onCancel: () => {
                this.game.addAlert(
                    'danger',
                    '{0} cancels the resolution of {1}',
                    context.player,
                    this
                );
                return true;
            },
            source: context.source
        });
    }

    handleStrDebuffSelected({ context, remainingCards, amount, choices, card }) {
        choices.push({ card, amount });
        remainingCards = remainingCards.filter((c) => c !== card);

        if (remainingCards.length > 0) {
            this.chooseStrDebuff({ context, remainingCards, amount: amount + 1, choices });
        } else {
            this.applyStrDebuffs({ context, choices });
        }
    }

    applyStrDebuffs({ context, choices }) {
        const fragments = choices.map((choice) =>
            Message.fragment('give {card} -{amount} STR', choice)
        );
        this.game.addMessage('{player} plays {source} to {fragments}', {
            player: context.player,
            source: this,
            fragments
        });

        for (const choice of choices) {
            this.untilEndOfPhase((ability) => ({
                match: choice.card,
                effect: ability.effects.modifyStrength(-choice.amount)
            }));
        }
    }
}

TheHatchlingsFeast.code = '16014';

module.exports = TheHatchlingsFeast;
