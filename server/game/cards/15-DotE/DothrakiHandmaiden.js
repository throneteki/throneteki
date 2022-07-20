const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class DothrakiHandmaiden extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.name === 'Daenerys Targaryen'),
            effect: [
                ability.effects.canMarshal({ type: 'attachment', facedown: true, parent: this }),
                ability.effects.canMarshalIntoShadows({ type: 'attachment', facedown: true, parent: this})
            ]
        });
        this.action({
            title: 'Attach facedown attachment',
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) => card.isMatch({ type: 'attachment', location: 'hand' }) && card.controller === context.player
            },
            message: '{player} uses {source} to reveal an attachment from their hand',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({
                        player: context.player,
                        cards: [context.target]
                    })).then({
                        handler: context => {
                            context.player.attach(context.player, context.event.cards[0], this, 'play', true);
                            this.lastingEffect(() => ({
                                condition: () => context.event.cards[0].parent === context.source,
                                targetLocation: 'any',
                                match: context.event.cards[0],
                                effect: ability.effects.setCardType('attachment')
                            }));
                        }
                    }),
                    context
                );
            }
        });
    }
}

DothrakiHandmaiden.code = '15014';

module.exports = DothrakiHandmaiden;
