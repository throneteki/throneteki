import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class PassBeneathTheShadow extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseStarted']);
    }

    onPhaseStarted() {
        if (this.game.currentPhase === 'plot') {
            this.hasGainedGoldThisRound = false;
            this.hasDrawnThisRound = false;
            this.hasBuffedThisRound = false;
        }
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            choices: {
                'Gain 1 gold': {
                    condition: () => this.controller.canGainGold() && !this.hasGainedGoldThisRound,
                    gameAction: GameActions.genericHandler(() => {
                        this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                        this.game.addGold(this.controller, 1);
                        this.hasGainedGoldThisRound = true;
                    })
                },
                'Pay 1 gold to draw a card': {
                    condition: () =>
                        this.controller.canDraw() &&
                        this.controller.gold >= 1 &&
                        !this.hasDrawnThisRound,
                    gameAction: GameActions.genericHandler(() => {
                        this.game.spendGold({ player: this.controller, amount: 1 });
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage(
                            '{0} uses {1} and pays 1 gold to draw 1 card',
                            this.controller,
                            this
                        );
                        this.hasDrawnThisRound = true;
                    })
                },
                'Give character +2 STR': {
                    condition: () =>
                        this.game.anyCardsInPlay((card) => card.getType() === 'character') &&
                        !this.hasBuffedThisRound,
                    gameAction: GameActions.genericHandler(() => {
                        this.game.promptForSelect(this.controller, {
                            activePromptTitle: 'Select a character',
                            source: this,
                            cardCondition: (card) =>
                                card.location === 'play area' && card.getType() === 'character',
                            onSelect: (player, card) => this.onCardSelected(player, card),
                            onCancel: (player) => this.cancelSelection(player)
                        });
                    })
                }
            }
        });
    }

    onCardSelected(player, card) {
        const str = 2;
        this.game.addMessage(
            '{0} uses {1} to give +{2} STR to {3} until the end of the phase',
            player,
            this,
            str,
            card
        );

        this.untilEndOfPhase((ability) => ({
            match: card,
            effect: ability.effects.modifyStrength(str)
        }));
        this.hasBuffedThisRound = true;

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
    }
}

PassBeneathTheShadow.code = '00364';

export default PassBeneathTheShadow;
