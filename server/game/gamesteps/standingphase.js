const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards()),
            new ActionWindow(this.game, 'After cards stand', 'standing')
        ]);
    }

    standCards() {
        this.game.raiseEvent('onStandAllCards', () => {
            _.each(this.game.getPlayers(), player => {
                this.standCardsForPlayer(player);
            });
        });
    }

    standCardsForPlayer(player) {
        let kneelingCards = this.game.allCards.filter(card => card.location === 'play area' && card.kneeled && card.controller === player && card.allowGameAction('stand'));
        let restrictedSubset = [];
        _.each(player.standPhaseRestrictions, restriction => {
            let restrictedCards = _.filter(kneelingCards, card => restriction.match(card));
            kneelingCards = _.difference(kneelingCards, restrictedCards);
            restrictedSubset.push({ max: restriction.max, cards: restrictedCards });
        });
        // Automatically stand non-restricted cards
        let cardsToStand = { automatic: kneelingCards, selected: [] };

        _.each(restrictedSubset, restriction => {
            this.selectRestrictedCards(cardsToStand, player, restriction);
        });
        this.game.queueSimpleStep(() => {
            this.selectOptionalCards(cardsToStand, player);
        });
        this.game.queueSimpleStep(() => {
            let finalCards = _.flatten(_.values(cardsToStand));
            player.faction.kneeled = false;
            _.each(finalCards, card => {
                player.standCard(card);
            });
        });
    }

    selectRestrictedCards(cardsToStand, player, restriction) {
        if(restriction.cards.length <= restriction.max) {
            cardsToStand.automatic = cardsToStand.automatic.concat(restriction.cards);
            return;
        }

        this.game.promptForSelect(player, {
            numCards: restriction.max,
            multiSelect: true,
            activePromptTitle: 'Select ' + restriction.max + ' cards to stand',
            gameAction: 'stand',
            cardCondition: card => restriction.cards.includes(card),
            onSelect: (player, cards) => {
                // The player must select as many cards as possible to stand
                // because standing during the standing phase is mandatory.
                if(cards.length < restriction.max) {
                    return false;
                }

                cardsToStand.selected = cardsToStand.selected.concat(cards);
                return true;
            }
        });
    }

    selectOptionalCards(cardsToStand, player) {
        let optionalStandCards = _.filter(cardsToStand.automatic, card => card.optionalStandDuringStanding);

        if(optionalStandCards.length === 0) {
            return;
        }

        cardsToStand.automatic = _.filter(cardsToStand.automatic, card => !card.optionalStandDuringStanding);

        this.game.promptForSelect(player, {
            numCards: 0,
            multiSelect: true,
            activePromptTitle: 'Select optional cards to stand',
            cardCondition: card => optionalStandCards.includes(card),
            onSelect: (player, cards) => {
                cardsToStand.selected = cardsToStand.selected.concat(cards);
                return true;
            }
        });
    }
}

module.exports = StandingPhase;
