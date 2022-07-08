const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class IPledgeMyLifeAndHonor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.defendingPlayer === this.controller
            },
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: { type: 'character', faction: 'thenightswatch' },
                message: '{player} uses {source} to search their deck and put {searchTarget} into play',
                gameAction: GameActions.putIntoPlay(context => ({
                    player: context.player,
                    card: context.searchTarget
                })).then({
                    target: {
                        cardCondition: (card, context) => (
                            card.location === 'play area' &&
                            card.controller === context.player &&
                            card.getTraits().some(trait => context.parentContext.searchTarget.hasTrait(trait)) &&
                            card.allowGameAction('sacrifice')
                        )
                    },
                    message: 'Then {player} sacrifices {target}',
                    handler: context => {
                        this.game.resolveGameAction(
                            GameActions.sacrificeCard(context => ({
                                player: context.player,
                                card: context.target
                            })),
                            context
                        );
                    }
                })
            })
        });
    }
}

IPledgeMyLifeAndHonor.code = '20024';

module.exports = IPledgeMyLifeAndHonor;
