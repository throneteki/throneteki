const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class BlackhavenRider extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'character' && card.isLoyal()
            },
            handler: context => {
                let selections = context.targets.selections.filter(selection => !!selection.value);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map(selection => GameActions.kneelCard({ player: selection.choosingPlayer, card: selection.value }))
                    )
                );
            }
        });
    }
}

BlackhavenRider.code = '25505';
BlackhavenRider.version = '1.1';

module.exports = BlackhavenRider;
