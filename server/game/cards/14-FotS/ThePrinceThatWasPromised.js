const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

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
            message: {
                format: '{player} uses {source} and kneels their faction card to either stand {namedCharacter} and draw, or search for them',
                args: { namedCharacter: () => this.selectedCardName }
            },
            choices: {
                'Stand and draw': {
                    message: '{player} chooses, and {gameAction}',
                    gameAction: GameActions.simultaneously(context => {
                        let actions = this.getThePromised(context.player) ? [GameActions.standCard(context => ({ card: this.getThePromised(context.player) }))] : [];
                        actions.push(GameActions.drawCards(context => ({ player: context.player, amount: 1 })));
                        return actions;
                    })
                },
                'Search': {
                    gameAction: GameActions.search({
                        title: 'Select a character',
                        match: { type: 'character', condition: card => card.name === this.selectedCardName },
                        location: ['draw deck', 'discard pile', 'dead pile'],
                        message: '{player} chooses to search their deck, discard pile and dead pile, and {gameAction}',
                        gameAction: GameActions.addToHand(context => ({
                            card: context.searchTarget
                        }))
                    })
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
