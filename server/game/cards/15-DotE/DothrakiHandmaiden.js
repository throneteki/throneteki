import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DothrakiHandmaiden extends DrawCard {
    // Dothraki Handmaiden (15014)
    // While you control Daenerys Targaryen, you may marshal facedown cards attached to Dothraki
    // Handmaiden as if they were in your hand.
    // Marshaling Action: Reveal an attachment from your hand. Attach it to Dothraki Handmaiden
    // facedown as an attachment.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.name === 'Daenerys Targaryen'
                ),
            effect: [
                ability.effects.canMarshal({ type: 'attachment', facedown: true, parent: this }),
                ability.effects.canMarshalIntoShadows({
                    type: 'attachment',
                    facedown: true,
                    parent: this
                })
            ]
        });
        this.action({
            title: 'Attach facedown attachment',
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.isMatch({ type: 'attachment', location: 'hand' }) &&
                    card.controller === context.player
            },
            phase: 'marshal',
            message: '{player} uses {source} to reveal an attachment from their hand',
            gameAction: GameActions.revealCards((context) => ({
                player: context.player,
                cards: [context.target]
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                message: 'Then {player} attaches it facedown to {source}',
                gameAction: GameActions.attach((context) => ({
                    player: context.player,
                    attachment: context.parentContext.revealed[0],
                    target: context.source,
                    facedown: true,
                    asAttachment: {}
                }))
            })
        });
    }
}

DothrakiHandmaiden.code = '15014';

export default DothrakiHandmaiden;
