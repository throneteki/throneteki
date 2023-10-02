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
            message: '{player} uses {source} and kneels their faction card to place 1 blood token on {source}',
            gameAction: GameActions.placeToken(() => ({ 
                card: this, token: Tokens.blood 
            })).then({
                message: 'Then, {player} searches their deck for an event',
                gameAction: GameActions.search({
                    title: 'Select an event',
                    match: { type: 'event' },
                    message: '{player} {gameAction}',
                    gameAction: GameActions.addToHand(context => ({
                        card: context.searchTarget
                    }))
                })
            })
        });
    }
}

SeaOfBlood.code = '12045';

module.exports = SeaOfBlood;
