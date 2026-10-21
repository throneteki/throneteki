import DrawCard from '../../drawcard.js';

class WeirwoodBow extends DrawCard {
    // Weirwood Bow (07043)
    // [thenightswatch] or Wildling character only.
    // Action: Kneel Weirwood Bow to choose a defending character. That character gets -2 STR until
    // the end of the challenge.
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
