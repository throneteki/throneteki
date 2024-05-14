const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class TheNorthRemembers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Each player sacrifices a character or location',
            phase: 'challenge',
            target: {
                type: 'select',
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a character or location',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    (card.getType() === 'character' || card.getType() === 'location')
            },
            handler: (context) => {
                let selections = context.targets.selections.filter(
                    (selection) => !!selection.value
                );

                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map((selection) =>
                            GameActions.sacrificeCard({
                                player: selection.choosingPlayer,
                                card: selection.value
                            })
                        )
                    )
                );
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onCharacterKilled: (event) =>
                    event.cardStateWhenKilled.controller === this.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

TheNorthRemembers.code = '06042';

module.exports = TheNorthRemembers;
