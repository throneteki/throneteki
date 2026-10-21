import DrawCard from '../../drawcard.js';

class SeptaLemore extends DrawCard {
    // Septa Lemore (20032)
    // While you control Aegon Targaryen, he gains insight.
    // Interrupt: When Septa Lemore leaves play, choose a [targaryen] character you control with
    // shadow. Return that character to shadows.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Aegon Targaryen',
            effect: ability.effects.addKeyword('Insight')
        });

        this.interrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isShadow() &&
                    card.controller === context.player &&
                    card.isFaction('targaryen')
            },
            message: '{player} uses {source} to return {target} to shadows',
            handler: (context) => {
                context.player.moveCard(context.target, 'shadows');
            }
        });
    }
}

SeptaLemore.code = '20032';

export default SeptaLemore;
