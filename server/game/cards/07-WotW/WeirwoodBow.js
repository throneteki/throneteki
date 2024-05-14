import DrawCard from '../../drawcard.js';

class WeirwoodBow extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' }, { trait: 'Wildling' });
        this.action({
            title: 'Give defending character -2 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending(),
                gameAction: 'decreaseStrength'
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-2)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} -2 STR until the end of the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

WeirwoodBow.code = '07043';

export default WeirwoodBow;
