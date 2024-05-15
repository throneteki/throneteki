import PlotCard from '../../plotcard.js';

class WardensOfTheSouth extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('tyrell'),
                onDeclaredAsDefender: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('tyrell')
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.event.card,
                    effect: ability.effects.modifyStrength(2)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} +2 STR until the end of the challenge',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

WardensOfTheSouth.code = '09046';

export default WardensOfTheSouth;
