const AgendaCard = require('../../agendacard');
const Message = require('../../Message');

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
            message: '{player} uses {source} and kneels their faction card to either stand the named character and draw, or search for the named character',
            choices: {
                // TODO: This needs a condition that the player can either stand
                // the Promise One, or can draw a card.
                'Stand and draw': context => {
                    let messageSegments = [];
                    let promised = this.getThePromised(context.player);

                    if(promised && promised.kneeled && promised.allowGameAction('stand')) {
                        context.player.standCard(promised);
                        messageSegments.push(Message.fragment('stand {card}', { card: promised }));
                    }

                    if(context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        messageSegments.push('draw 1 card');
                    }

                    if(messageSegments.length > 0) {
                        this.game.addMessage('{0} chooses to {1}', context.player, messageSegments);
                    }
                },
                'Search': context => {
                    this.game.addMessage('{0} chooses to search their deck, discard pile and dead pile for the named character', context.player);
                    this.game.promptForDeckSearch(context.player, {
                        activePromptTitle: 'Select a card',
                        cardCondition: card => card.name === this.selectedCardName && card.getType() === 'character',
                        additionalLocations: ['dead pile', 'discard pile'],
                        onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
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

    cardSelected(player, card, valid) {
        if(valid) {
            this.game.addMessage('{0} adds {1} to their hand from their {2}', player, card, card.location);
            player.moveCard(card, 'hand');
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand', player, this);
    }

    onDecksPrepared() {
        this.game.promptForCardName({
            title: 'Name a unique character',
            player: this.controller,
            match: cardData => cardData.type === 'character' && cardData.unique,
            onSelect: (player, cardName) => this.selectCardName(player, cardName),
            source: this
        });
    }

    selectCardName(player, cardName) {
        this.game.addMessage('{0} names {1} for {2}', player, cardName, this);
        this.selectedCardName = cardName;
    }
}

ThePrinceThatWasPromised.code = '14045';

module.exports = ThePrinceThatWasPromised;
