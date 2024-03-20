const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class ASouthronPeace extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: '{player} uses {source} to prevent military challenges from being initiated between {opponent} and themselves until they reveal a new plot card',
            handler: context => {
                context.game.resolveGameAction(GameActions.simultaneously([
                    GameActions.genericHandler(context => {
                        this.lastingEffect(ability => ({
                            until: {
                                onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === this.controller
                            },
                            targetController: context.opponent,
                            effect: ability.effects.cannotInitiateChallengeType('military', opponent => opponent === this.controller)
                        }));
                    }),
                    GameActions.genericHandler(context => {
                        this.lastingEffect(ability => ({
                            until: {
                                onCardEntersPlay: event => event.card.getType() === 'plot' && event.card.controller === this.controller
                            },
                            targetController: 'current',
                            effect: ability.effects.cannotInitiateChallengeType('military', opponent => opponent === context.opponent)
                        }));
                    })
                ]), context);
            }
        });
    }
}

ASouthronPeace.code = '25039';

module.exports = ASouthronPeace;
