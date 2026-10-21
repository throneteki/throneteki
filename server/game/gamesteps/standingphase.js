import { flatten } from '../../Array.js';
import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import ActionWindow from './actionwindow.js';
import GameActions from '../GameActions/index.js';
import { Flags } from '../Constants/Flags.js';

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards()),
            new ActionWindow(this.game, 'After cards stand', 'standing')
        ]);
    }

    standCards() {
        const selections = this.game.getPlayers().map((player) => this.selectCardsToStand(player));

        this.game.queueSimpleStep(() => {
            const cards = flatten(
                selections.map((selection) => selection.automatic.concat(selection.selected))
            );
            this.game.resolveGameAction(
                GameActions.simultaneously(cards.map((card) => GameActions.standCard({ card })))
            );
        });
    }

    selectCardsToStand(player) {
        let kneelingCards = this.game.allCards.filter(
            (card) =>
                ['faction', 'play area'].includes(card.location) &&
                card.kneeled &&
                card.controller === player &&
                card.allowGameAction('stand')
        );
        let restrictedSubset = [];
        for (let restriction of player.standPhaseRestrictions) {
            let restrictedCards = kneelingCards.filter((card) => restriction.match(card));
            kneelingCards = kneelingCards.filter((card) => !restrictedCards.includes(card));
            restrictedSubset.push({ max: restriction.max, cards: restrictedCards });
        }
        // Automatically stand non-restricted cards
        let cardsToStand = { automatic: kneelingCards, selected: [] };

        for (let restriction of restrictedSubset) {
            this.selectRestrictedCards(cardsToStand, player, restriction);
        }
        this.game.queueSimpleStep(() => {
            this.selectOptionalCards(cardsToStand, player);
        });

        return cardsToStand;
    }

    selectRestrictedCards(cardsToStand, player, restriction) {
        if (restriction.cards.length <= restriction.max) {
            cardsToStand.automatic = cardsToStand.automatic.concat(restriction.cards);
            return;
        }

        this.game.promptForSelect(player, {
            numCards: restriction.max,
            multiSelect: true,
            activePromptTitle: 'Select ' + restriction.max + ' cards to stand',
            gameAction: 'stand',
            cardCondition: (card) => restriction.cards.includes(card),
            canCancel: this.game.manualMode.enabled,
            onSelect: (player, cards) => {
                // The player must select as many cards as possible to stand
                // because standing during the standing phase is mandatory.
                if (cards.length < restriction.max) {
                    return false;
                }

                cardsToStand.selected = cardsToStand.selected.concat(cards);
                return true;
            }
        });
    }

    selectOptionalCards(cardsToStand, player) {
        let optionalStandCards = cardsToStand.automatic.filter((card) =>
            card.hasFlag(Flags.standingOptions.optionalStand)
        );

        if (optionalStandCards.length === 0) {
            return;
        }

        cardsToStand.automatic = cardsToStand.automatic.filter(
            (card) => !card.hasFlag(Flags.standingOptions.optionalStand)
        );

        this.game.promptForSelect(player, {
            mode: 'unlimited',
            activePromptTitle: 'Select optional cards to stand',
            cardCondition: (card) => optionalStandCards.includes(card),
            onSelect: (player, cards) => {
                cardsToStand.selected = cardsToStand.selected.concat(cards);
                return true;
            }
        });
    }
}

export default StandingPhase;
