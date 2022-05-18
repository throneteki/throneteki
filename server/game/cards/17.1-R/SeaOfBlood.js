const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class SeaOfBlood extends AgendaCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next event by 2',
            cost: ability.costs.discardTokenFromSelf(Tokens.blood),
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextPlayedCardCost(2, card => card.getType() === 'event')
                }));

                this.game.addMessage('{0} discards 1 blood token from {1} to reduce the cost of the next event they play this phase by 2',
                    context.player, this);
            }
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} and kneels their faction card to place 1 blood token on {source}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.blood })),
                    context
                );
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select an event',
                    cardCondition: card => card.getType() === 'event',
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
            
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            this.game.addMessage('Then {0} searches their deck and adds {1} to their hand', player, card);
            player.moveCard(card, 'hand');
        }
    }

    doneSelecting(player) {
        this.game.addMessage('Then {0} searches their deck, but does not add any card to their hand', player);
    }
}

SeaOfBlood.code = '17149';

module.exports = SeaOfBlood;
