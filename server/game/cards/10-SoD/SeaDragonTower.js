import DrawCard from '../../drawcard.js';

class SeaDragonTower extends DrawCard {
    // Sea Dragon Tower (10026)
    // Challenges Action: Kneel Sea Dragon Tower to choose a character. Until the end of the phase,
    // that character gains a [power] icon.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give power icon',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addIcon('power')
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give a {2} icon to {3}',
                    context.player,
                    this,
                    'power',
                    context.target
                );
            }
        });
    }
}

SeaDragonTower.code = '10026';

export default SeaDragonTower;
