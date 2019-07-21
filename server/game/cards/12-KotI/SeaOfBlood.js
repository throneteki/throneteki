const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class SeaOfBlood extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: () => this.tokens[Tokens.blood],
                match: card => card.getType() === 'event'
            })
        });

        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: ['intrigue', 'power'] }),
            effect: ability.effects.cannotPlay(card => card.getType() === 'event')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} users {source} and kneels their faction card to place 1 blood token on {source}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.blood })),
                    context
                );
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select an event',
                    cardCondition: card => card.getType() === 'event',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('Then {0} uses {1} to search their deck and add {2} to their hand', player, this, card);
        player.moveCard(card, 'hand');
    }

    doneSelecting(player) {
        this.game.addMessage('Then {0} uses {1} to search their deck, but does not add any card to their hand', player, this);
    }
}

SeaOfBlood.code = '12045';

module.exports = SeaOfBlood;
