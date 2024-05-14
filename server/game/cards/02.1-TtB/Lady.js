import DrawCard from '../../drawcard.js';

class Lady extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.action({
            title: 'Attach Lady to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    this.controller.canAttach(this, card) &&
                    card.location === 'play area' &&
                    card !== this.parent
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.controller.attach(this.controller, this, context.target);
                let message = '{0} pays 1 gold to attach {1} to {2}';

                if (context.target.name === 'Sansa Stark' && context.target.kneeled) {
                    context.target.controller.standCard(context.target);
                    message += ' and stand her';
                }

                this.game.addMessage(message, this.controller, this, context.target);
            }
        });
    }
}

Lady.code = '02004';

export default Lady;
