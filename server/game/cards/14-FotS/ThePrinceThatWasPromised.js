const AgendaCard = require('../../agendacard');

class ThePrinceThatWasPromised extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.name !== this.selectedCardName,
            effect: ability.effects.cannotGainPower()
        });

        this.reaction({
            when: {
                afterChallenge: event => this.hasWonBy5(event)
            },
            cost: ability.costs.kneelFactionCard(),
            choices: {
                // TODO: This needs a condition that the player can either stand
                // the Promise One, or can draw a card.
                'Stand and draw': context => {
                    let message = '{0} uses {1} and kneels their faction card to ';
                    let messageSegments = [];
                    let promised = this.getThePromised(context.player);

                    if(promised && promised.kneeled && promised.allowGameAction('stand')) {
                        context.player.standCard(promised);
                        messageSegments.push('stand {2}');
                    }

                    if(context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        messageSegments.push('draw 1 card');
                    }

                    this.game.addMessage(message + messageSegments.join(', '), context.player, context.source, promised);
                },
                'Search': context => {
                    this.game.promptForDeckSearch(context.player, {
                        activePromptTitle: 'Select a card',
                        cardCondition: card => card.name === this.selectedCardName && card.getType() === 'character',
                        additionalLocations: ['dead pile', 'discard pile'],
                        onSelect: (player, card) => this.cardSelected(player, card),
                        onCancel: player => this.doneSelecting(player),
                        source: this
                    });
                }
            }
        });
    }

    hasWonBy5(event) {
        return (
            event.challenge.challengeType === 'power' &&
            event.challenge.winner === this.controller &&
            event.challenge.strengthDifference >= 5
        );
    }

    getThePromised(player) {
        return player.filterCardsInPlay(card => (
            card.getType() === 'character' &&
            card.name === this.selectedCardName
        ))[0];
    }

    controlsKneelingChar(player) {
        let promised = this.getThePromised(player);
        return promised && promised.kneeled && promised.allowGameAction('stand');
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to search and add {2} to their hand from their {3}', player, this, card, card.location);
        player.moveCard(card, 'hand');
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play', player, this);
    }

    onDecksPrepared() {
        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Name a unique character',
                controls: [
                    { type: 'card-name', command: 'menuButton', method: 'selectCardName' }
                ]
            }
        });
    }

    selectCardName(player, cardName) {
        if(!this.isUniqueCharacter(cardName)) {
            return false;
        }

        this.game.addMessage('{0} names {1} for {2}', player, cardName, this);
        this.selectedCardName = cardName;

        return true;
    }

    isUniqueCharacter(cardName) {
        return Object.values(this.game.cardData).some(card => (
            card.type === 'character' &&
            card.unique &&
            card.name === cardName
        ));
    }
}

ThePrinceThatWasPromised.code = '14045';

module.exports = ThePrinceThatWasPromised;
