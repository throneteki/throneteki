import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Foamdrinker extends DrawCard {
    // Foamdrinker (21005)
    // While you control Dagmer Cleftjaw, he gains assault.
    // Action: Kneel Foamdrinker to choose a Captain or Raider character. Until the end of the
    // phase, that character gains a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Dagmer Cleftjaw' && card.controller === context.source.controller,
            effect: ability.effects.addKeyword('Assault')
        });

        this.action({
            title: 'Give icon',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Captain') || card.hasTrait('Raider'))
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} kneels {source} to give {icon} icon to {target} until the end of the phase',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.addIcon(icon)
                    }))
            })
        });
    }
}

Foamdrinker.code = '21005';

export default Foamdrinker;
