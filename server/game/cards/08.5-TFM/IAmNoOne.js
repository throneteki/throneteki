import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class IAmNoOne extends DrawCard {
    // I Am No One (08082)
    // Action: Choose a character you control with printed cost 3 or lower. Until the end of the
    // phase, that character loses all faction affiliations and Traits, gains insight and stealth,
    // and does not kneel when declared as an attacker.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth/insight',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.controller === context.source.controller
            },
            message: '{player} plays {source} and chooses {target} as its target',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: [
                    ability.effects.losesAllFactions(),
                    ability.effects.losesAllTraits(),
                    ability.effects.addKeyword('stealth'),
                    ability.effects.addKeyword('insight'),
                    ability.effects.doesNotKneelAsAttacker()
                ]
            }))
        });
    }
}

IAmNoOne.code = '08082';

export default IAmNoOne;
