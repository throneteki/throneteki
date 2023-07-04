const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class LadyStoneheart extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' 
                            && card.controller === context.choosingPlayer 
                            && card.getType() === 'character' 
                            && card.canBeKilled()
                            && (card.isLoyal() || card.hasTrait('House Frey'))
            },
            handler: context => {
                let selections = context.targets.selections.filter(selection => !!selection.value);
                for(const selection of selections) {
                    this.game.addMessage('{0} kills {1} for {2}', selection.choosingPlayer, selection.value, this);
                }
                this.game.resolveGameAction(
                    GameActions.kill(() => { victims: selections.map(selection => ({ player: selection.choosingPlayer, card: selection.value })) })
                );
            }
        });

        this.action({
            title: 'Put into play',
            phase: 'dominance',
            location: 'dead pile',
            condition: () => this.controller.canPutIntoPlay(this),
            cost: ability.costs.choose({
                'Discard power': ability.costs.discardPower(1, card => card.getType() === 'character' && card.hasTrait('Brotherhood')),
                'Discard kiss token': ability.costs.discardTokenFromCard(Tokens.kiss, 1, card => card.controller === this.controller && card.hasToken(Tokens.kiss) && card.location === 'play area')
            }),
            handler: context => {
                context.player.putIntoPlay(this);
                if(context.costs.discardPower) {
                    this.game.addMessage('{0} discards 1 power from {1} to put {2} into play from their dead pile',
                        context.player, context.costs.discardPower, this);
                } else {
                    this.game.addMessage('{0} discards 1 kiss token from {1} to put {2} into play from their dead pile',
                        context.player, context.costs.discardToken, this);
                }
            }
        });
    }
}

LadyStoneheart.code = '20041';

module.exports = LadyStoneheart;
