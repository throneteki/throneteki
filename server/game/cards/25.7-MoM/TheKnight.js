const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');
const {ChallengeTracker} = require('../../EventTrackers');

class TheKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);
        
        this.action({
            title: 'Return 2 characters to raise claim',
            phase: 'challenge',
            limit: ability.limit.perRound(1),
            chooseOpponent: player => player.discardPile.filter(card => card.getType() === 'character').length >= 2,
            message: '{player} uses {source} to return 2 characters from {opponent}\'s discard pile to their hand',
            handler: context => {
                this.game.promptForSelect(context.player, {
                    cardCondition: { type: 'character', location: 'discard pile', condition: card => card.controller === context.opponent && GameActions.placeCard({ card, location: 'hand' }).allow() },
                    source: this,
                    numCards: 2,
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} returns {1} to {2}\'s hand', player, cards, context.opponent);
                        this.game.resolveGameAction(
                            GameActions.simultaneously(
                                cards.map(card => GameActions.placeCard({ card, location: 'hand' }))
                            ).then({
                                message: {
                                    format: 'Then, {player} raises the claim on their revealed plot card by 1 during the next challenge they initiate against {opponent} this phase',
                                    args: { opponent: context => context.parentContext.opponent }
                                },
                                handler: context => {
                                    let challengeMatch = { initiatingPlayer: context.player, initiatedAgainstPlayer: context.parentContext.opponent };
                                    let numInitiated = this.tracker.count(challengeMatch);
                                    this.untilEndOfPhase(ability => ({
                                        condition: () => this.game.isDuringChallenge(challengeMatch) && this.tracker.count(challengeMatch) <= numInitiated + 1,
                                        match: card => card === context.player.activePlot,
                                        effect: ability.effects.modifyClaim(1)
                                    }));
                                }
                            }), 
                            context
                        );
                        return true;
                    }
                });
            }
        });
    }
}

TheKnight.code = '25513';
TheKnight.version = '1.2';

module.exports = TheKnight;
