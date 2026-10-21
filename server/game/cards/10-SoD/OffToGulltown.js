import DrawCard from '../../drawcard.js';

class OffToGulltown extends DrawCard {
    // "Off To Gulltown" (10044)
    // Challenges Action: Choose a character. Until the end of the phase, that character gains a
    // [military], an [intrigue], and a [power] icon. Draw 1 card.
    setupCardAbilities() {
        this.action({
            title: 'Give icons to character',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.addIcon('military'),
                        ability.effects.addIcon('intrigue'),
                        ability.effects.addIcon('power')
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} to give a {2}, an {3}, and a {4} icon to {5} until the end of the phase',
                    context.player,
                    this,
                    'military',
                    'intrigue',
                    'power',
                    context.target
                );

                if (context.player.drawCardsToHand(1).length > 0) {
                    this.game.addMessage('{0} draws 1 card for {1}', context.player, this);
                }
            }
        });
    }
}

OffToGulltown.code = '10044';

export default OffToGulltown;
