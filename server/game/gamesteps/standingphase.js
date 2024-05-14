const { flatten } = require('../../Array');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const GameActions = require('../GameActions');

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards()),
            new ActionWindow(this.game, 'After cards stand', 'standing')
        ]);
    }

    standCards() {
        for (let player of this.game.getPlayers()) {
            this.standCardsForPlayer(player);
        }
    }

    standCardsForPlayer(player) {
        let kneelingCards = this.game.allCards.filter(
            (card) =>
                card.location === 'play area' &&
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
        this.game.queueSimpleStep(() => {
            let finalCards = flatten(cardsToStand.automatic.concat(cardsToStand.selected));
            player.faction.kneeled = false;
            let standActions = [];
            for (let card of finalCards) {
                standActions.push(GameActions.standCard({ card: card }));
            }
            this.game.resolveGameAction(GameActions.simultaneously(standActions));
        });
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
        let optionalStandCards = cardsToStand.automatic.filter(
            (card) => card.optionalStandDuringStanding
        );

        if (optionalStandCards.length === 0) {
            return;
        }

        cardsToStand.automatic = cardsToStand.automatic.filter(
            (card) => !card.optionalStandDuringStanding
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

module.exports = StandingPhase;
