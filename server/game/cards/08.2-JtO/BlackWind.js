import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackWind extends DrawCard {
    // Black Wind (08032)
    // While you control Asha Greyjoy, she gains renown.
    // Reaction: After a character you control discards a location or attachment using pillage, draw
    // 1 card. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Asha Greyjoy' && card.controller === context.source.controller,
            effect: ability.effects.addKeyword('renown')
        });

        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source.controller === context.source.controller &&
                    ['attachment', 'location'].includes(event.card.getType()) &&
                    context.source.controller.canDraw()
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

BlackWind.code = '08032';

export default BlackWind;
