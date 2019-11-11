const DrawCard = require('../../drawcard');

class DothrakiHandmaiden extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.name === 'Daenerys Targaryen'),
            effect: ability.effects.canMarshal({ type: 'attachment', facedown: true, parent: this })
        });
        this.action({
            title: 'Attach facedown attachment',
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) => card.isMatch({ type: 'attachment', location: 'hand' }) && card.controller === context.player
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to reveal {2} and attach it under {1}', context.player, this, context.target);
                context.player.attach(context.player, context.target, this, 'play', true);
                this.lastingEffect(() => ({
                    condition: () => context.target.parent === this,
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.setCardType('attachment')
                }));
            }
        });
    }
}

DothrakiHandmaiden.code = '15014';

module.exports = DothrakiHandmaiden;
