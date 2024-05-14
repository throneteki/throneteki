import DrawCard from '../../drawcard.js';

class ConsolidationOfPower extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel 4 STR worth of characters',
            phase: 'marshal',
            target: {
                activePromptTitle: 'Select character(s)',
                maxStat: () => 4,
                cardStat: (card) => card.getStrength(),
                singleController: true,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to kneel {2}',
                    context.player,
                    this,
                    context.target
                );
                for (let card of context.target) {
                    card.controller.kneelCard(card);
                }

                if (!context.target.some((card) => card.allowGameAction('gainPower'))) {
                    return;
                }

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select character to gain power',
                    source: this,
                    cardCondition: (card) => context.target.includes(card),
                    gameAction: 'gainPower',
                    onSelect: (player, card) => this.onPowerSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onPowerSelected(player, card) {
        card.modifyPower(1);

        this.game.addMessage('Then {0} chooses {1} to gain 1 power', player, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

ConsolidationOfPower.code = '01062';

export default ConsolidationOfPower;
