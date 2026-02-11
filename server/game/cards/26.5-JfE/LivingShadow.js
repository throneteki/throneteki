import DrawCard from '../../drawcard.js';

class LivingShadow extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeKilled()
        });

        this.forcedReaction({
            when: {
                onBypassedByStealth: (event) =>
                    event.source === this && this.canAttachTo(event.target)
            },
            message: {
                format: '{player} is forced to attach {source} to {character}"',
                args: { character: (context) => context.event.target }
            },
            handler: (context) => {
                context.player.attach(context.player, this, context.event.target, 'effect');
                this.lastingEffect((ability) => ({
                    condition: () => !!this.parent,
                    targetLocation: 'any',
                    match: this,
                    effect: [
                        ability.effects.setCardType('attachment'),
                        ability.effects.addKeyword('Terminal'),
                        ability.effects.addTrait('Condition')
                    ]
                }));

                this.lastingEffect((ability) => ({
                    condition: () => this.location === 'play area',
                    targetLocation: 'any',
                    targetController: 'any',
                    match: (card) => card === this.parent,
                    effect: ability.effects.cannotBeSaved()
                }));
            }
        });
    }

    canAttachTo(card) {
        // Need to fake a snapshot of this card when converted to an attachment to determine if it CAN be attached
        const attachment = this.createSnapshot();
        attachment.setCardType('attachment');
        attachment.addKeyword('Terminal');
        attachment.addTrait('Condition');

        return attachment.controller.canAttach(attachment, card);
    }
}

LivingShadow.code = '26081';

export default LivingShadow;
