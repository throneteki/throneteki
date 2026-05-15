import AgendaCard from '../../agendacard.js';
import { Tokens } from '../../Constants/Tokens.js';

class SeekingFortunes extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce cost or move gold',
            cost: ability.costs.kneelFactionCard(),
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Reduce cost', method: 'reduceCost' },
                            { text: 'Move gold', method: 'moveGold' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    reduceCost() {
        this.untilEndOfPhase((ability) => ({
            targetController: 'current',
            effect: ability.effects.reduceNextMarshalledOrPlayedCardCost(
                1,
                (card) => card.isBestow() || card.getType() === 'location'
            )
        }));
        this.game.addMessage(
            '{0} uses {1} to kneel their faction card and reduce the cost of the next bestow card or location by 1',
            this.controller,
            this
        );

        return true;
    }

    moveGold() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a card',
            source: this,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === this.controller &&
                this.controller.gold >= 1 &&
                !card.hasToken(Tokens.gold),
            onSelect: (player, card) => this.onCardSelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.transferGold({ from: player, to: card, amount: 1 });

        this.game.addMessage(
            '{0} uses {1} and kneels their faction card to move 1 gold from from their gold pool to {2}',
            player,
            this,
            card
        );

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
    }
}

SeekingFortunes.code = '00365';

export default SeekingFortunes;
