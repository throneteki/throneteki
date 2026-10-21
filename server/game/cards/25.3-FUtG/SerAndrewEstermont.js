import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerAndrewEstermont extends DrawCard {
    // Ser Andrew Estermont (25041)
    // Interrupt: When a unique [baratheon] character would be killed, kill a R'hllor character to
    // save that character and have it gain 1 power. (Limit once per round.)
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller &&
                    event.card.isUnique() &&
                    event.card.isFaction('baratheon')
            },
            cost: ability.costs.kill((card) => card.hasTrait("R'hllor")),
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} and kills {costs.kill} to save {character} and have it gain 1 power',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.genericHandler((context) => {
                    context.event.saveCard();
                }),
                GameActions.gainPower((context) => ({ card: context.event.card }))
            ])
        });
    }
}

SerAndrewEstermont.code = '25041';

export default SerAndrewEstermont;
