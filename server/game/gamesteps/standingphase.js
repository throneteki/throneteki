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
        let kneelingCards = this.game.allCards.filter(card => card.location === 'play area' && card.kneeled && card.controller === player && card.standsDuringStanding && card.allowGameAction('stand'));
        let restrictedSubset = [];
        _.each(player.standPhaseRestrictions, restriction => {
            let restrictedCards = _.filter(kneelingCards, card => restriction.match(card));
            kneelingCards = _.difference(kneelingCards, restrictedCards);
            restrictedSubset.push({ max: restriction.max, cards: restrictedCards });
        });
        // Automatically stand non-restricted cards
        let cardsToStand = kneelingCards;

        _.each(restrictedSubset, restriction => {
            this.selectRestrictedCards(cardsToStand, player, restriction);
        });
        this.game.queueSimpleStep(() => {
            player.faction.kneeled = false;
            _.each(cardsToStand, card => {
                player.standCard(card);
            });
        });
    }

    selectRestrictedCards(cardsToStand, player, restriction) {
        if(restriction.cards.length <= restriction.max) {
            _.each(restriction.cards, card => cardsToStand.push(card));
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

                _.each(cards, card => cardsToStand.push(card));
                return true;
            }
        });
    }
}

module.exports = StandingPhase;
